import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub } from '@/components/ui/sidebar';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { SourceTree, SourceTreeItem, type CreateBackupFormData } from '@/types/backups';
import { Destination } from '@/types/destinations';
import { Head, useForm } from '@inertiajs/react';
import { ChevronRight, File, Folder } from 'lucide-react';
import { FormEvent } from 'react';

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
                                {form.data.source_path && <p className="text-sm text-muted-foreground">{form.data.source_path}</p>}
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
    if (!item.dir) {
        return (
            <SidebarMenuButton type="button" className="data-[active=true]:bg-transparent">
                <Checkbox
                    checked={selectedPath === item.path}
                    onClick={(e) => {
                        e.stopPropagation();
                        onSelectPath(item.path);
                    }}
                />
                <File />
                {item.name}
            </SidebarMenuButton>
        );
    }

    return (
        <SidebarMenuItem>
            <Collapsible className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90">
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton type="button">
                        <ChevronRight className="transition-transform" />
                        <Checkbox
                            checked={selectedPath === item.path}
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectPath(item.path);
                            }}
                        />
                        <Folder />
                        {item.name}
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {item.children.map((subItem) => (
                            <Tree key={subItem.path} item={subItem} selectedPath={selectedPath} onSelectPath={onSelectPath} />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    );
}
