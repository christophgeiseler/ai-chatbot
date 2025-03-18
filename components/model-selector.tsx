'use client';

import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';

const models = [
  {
    value: 'gpt-4-turbo-preview',
    label: 'GPT-4 Turbo',
  },
  {
    value: 'gpt-3.5-turbo',
    label: 'GPT-3.5 Turbo',
  }
] as const;

export function ModelSelector({
  selectedModelId,
}: {
  selectedModelId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedModelId
            ? models.find((model) => model.value === selectedModelId)?.label
            : 'Select model...'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search model..." />
          <CommandEmpty>No model found.</CommandEmpty>
          <CommandGroup>
            {models.map((model) => (
              <CommandItem
                key={model.value}
                value={model.value}
                onSelect={async (currentValue: string) => {
                  setOpen(false);
                  await fetch('/api/chat-model', {
                    method: 'POST',
                    body: JSON.stringify({
                      model: currentValue,
                    }),
                  });
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedModelId === model.value
                      ? 'opacity-100'
                      : 'opacity-0',
                  )}
                />
                {model.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
