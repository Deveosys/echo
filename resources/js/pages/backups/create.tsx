import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import DotsLoader from '@/components/ui/dots-loader';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SourceTree, SourceTreeItem, type CreateBackupFormData } from '@/types/backups';
import { Destination } from '@/types/destinations';
import { Head, useForm } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import { AlertCircle, ChevronRight, File, Folder } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Backups',
        href: route('backups.index'),
    },
    {
        title: 'Create',
        href: route('backups.create'),
    },
];

export default function BackupsCreate({ sourceTree, destinations }: { sourceTree: SourceTree; destinations: Destination[] }) {
    const form = useForm<CreateBackupFormData>({
        name: '',
        destination_id: -1,
        source_path: '',
        frequency: 'daily',
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        form.post(route('backups.store'), {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Backups" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Heading title="Create backup" description="Create a new backup" />
                <form onSubmit={handleSubmit}>
                    <div className="grid max-w-xl gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Label>Name</Label>
                                <Input type="text" value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} />
                                {form.errors.name && <p className="text-red-500">{form.errors.name}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Label>Destination</Label>
                                <Select
                                    value={form.data.destination_id.toString()}
                                    onValueChange={(value) => form.setData('destination_id', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {destinations.map((destination) => (
                                            <SelectItem key={destination.id} value={destination.id.toString()}>
                                                {destination.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {form.errors.destination_id && <p className="text-red-500">{form.errors.destination_id}</p>}
                            </div>
                            <div className="col-span-2 h-72 overflow-y-auto rounded-md border bg-muted p-4">
                                <Label>Source</Label>
                                <p className="line-clamp-1 h-6 text-sm text-muted-foreground" title={form.data.source_path || 'No source selected'}>
                                    {form.data.source_path || 'No source selected'}
                                </p>

                                <SidebarMenu>
                                    {sourceTree.map((item) => {
                                        return (
                                            <Tree
                                                key={item.path}
                                                item={item}
                                                selectedPath={form.data.source_path}
                                                onSelectPath={(path) => form.setData('source_path', path)}
                                            />
                                        );
                                    })}
                                </SidebarMenu>
                                {form.errors.source_path && <p className="text-red-500">{form.errors.source_path}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={form.processing}>
                                {form.processing ? 'Creating...' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function Tree({ item, selectedPath, onSelectPath }: { item: SourceTreeItem; selectedPath: string; onSelectPath: (path: string) => void }) {
    const [treeItem, setTreeItem] = useState<SourceTreeItem>(item);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const loadSourceTreeLevel = (dir: string) => {
        setLoading(true);
        axios
            .post(route('backups.loadSourceTreeLevel'), {
                dir,
            })
            .then(function (response) {
                setError(null);
                setTreeItem({ ...treeItem, loaded: true, children: response.data });
            })
            .catch(function (error: AxiosError) {
                setError(error.message);
                toast.error('Failed to load source tree level');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    if (!treeItem.dir) {
        return (
            <SidebarMenuButton type="button" className="data-[active=true]:bg-transparent">
                <TreeCheckbox checked={selectedPath === treeItem.path} onClick={() => onSelectPath(treeItem.path)} />
                <File />
                {treeItem.name}
            </SidebarMenuButton>
        );
    }

    return (
        <SidebarMenuItem>
            <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90" open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                        type="button"
                        onClick={() => {
                            if (!treeItem.loaded && !loading && !open) {
                                loadSourceTreeLevel(treeItem.path);
                            }
                        }}
                    >
                        <ChevronRight className="transition-transform" />
                        <TreeCheckbox
                            checked={selectedPath === treeItem.path}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectPath(treeItem.path);
                            }}
                        />
                        <Folder />
                        {treeItem.name}
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {treeItem.loaded ? (
                            treeItem.children.map((subItem) => (
                                <Tree key={subItem.path} item={subItem} selectedPath={selectedPath} onSelectPath={onSelectPath} />
                            ))
                        ) : error ? (
                            <div className="flex h-full items-center gap-2 pl-1.5">
                                <AlertCircle className="h-4 w-4 text-red-500" />
                                <p className="text-sm text-red-500">{error}</p>
                            </div>
                        ) : (
                            <div className="flex h-full items-center gap-2 p-1.5">
                                <DotsLoader />
                            </div>
                        )}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
}

function TreeCheckbox({ checked, onClick }: { checked: boolean; onClick: (e: React.MouseEvent<HTMLInputElement>) => void }) {
    return (
        <div className="group grid size-4 grid-cols-1">
            <input
                type="checkbox"
                className="col-start-1 row-start-1 appearance-none rounded border bg-muted checked:border-primary checked:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                checked={checked}
                onClick={onClick}
            />
            <svg
                fill="none"
                viewBox="0 0 14 14"
                className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
            >
                <path
                    d="M3 8L6 11L11 3.5"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 group-has-[:checked]:opacity-100"
                />
                <path
                    d="M3 7H11"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 group-has-[:indeterminate]:opacity-100"
                />
            </svg>
        </div>
    );
}
