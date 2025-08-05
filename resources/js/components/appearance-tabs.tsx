import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Appearance, useAppearance } from '@/hooks/use-appearance';
import { LucideIcon, Monitor, Moon, Sun } from 'lucide-react';

export default function AppearanceToggleTab() {
    const { appearance, updateAppearance } = useAppearance();

    const tabs: { value: Appearance; icon: LucideIcon; label: string }[] = [
        { value: 'light', icon: Sun, label: 'Light' },
        { value: 'dark', icon: Moon, label: 'Dark' },
        { value: 'system', icon: Monitor, label: 'System' },
    ];

    return (
        <Tabs defaultValue={appearance}>
            <TabsList>
                {tabs.map(({ value, icon: Icon, label }) => (
                    <TabsTrigger value={value} key={value} onClick={() => updateAppearance(value)}>
                        <Icon className="-ml-1 h-4 w-4" />
                        <span className="ml-1.5 text-sm">{label}</span>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}
