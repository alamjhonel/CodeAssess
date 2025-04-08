
// This component is read-only but let's add an improved interface for handling rubric items

import React, { useState } from 'react';
import { FormField } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Trash, Plus, Info } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

type RubricItem = {
  name: string;
  weight: number;
};

interface AssessmentRubricFieldsProps {
  form: any;
  defaultItems: string[];
}

const AssessmentRubricFields: React.FC<AssessmentRubricFieldsProps> = ({ 
  form, 
  defaultItems 
}) => {
  const [customItem, setCustomItem] = useState('');
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [rubricItems, setRubricItems] = useState<RubricItem[]>([]);

  const addCustomItem = () => {
    if (customItem.trim() && !customItems.includes(customItem.trim())) {
      const newItems = [...customItems, customItem.trim()];
      setCustomItems(newItems);
      form.setValue('customRubricItems', newItems);
      setCustomItem('');
    }
  };

  const toggleItem = (item: string) => {
    const newSelectedItems = selectedItems.includes(item)
      ? selectedItems.filter(i => i !== item)
      : [...selectedItems, item];
    
    setSelectedItems(newSelectedItems);
    form.setValue('rubricItems', newSelectedItems);
    
    // Update rubric items with weights
    const updatedRubricItems = newSelectedItems.map(name => {
      const existingItem = rubricItems.find(item => item.name === name);
      return existingItem || { name, weight: 10 };
    });
    
    setRubricItems(updatedRubricItems);
    form.setValue('rubric', updatedRubricItems);
  };

  const updateItemWeight = (index: number, weight: number) => {
    const updated = [...rubricItems];
    updated[index] = { ...updated[index], weight };
    setRubricItems(updated);
    form.setValue('rubric', updated);
  };

  const removeCustomItem = (item: string) => {
    const newItems = customItems.filter(i => i !== item);
    setCustomItems(newItems);
    form.setValue('customRubricItems', newItems);
    
    if (selectedItems.includes(item)) {
      toggleItem(item);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-card/50">
      <div className="mb-4">
        <Label className="text-lg font-medium mb-4 flex items-center text-foreground">
          Assessment Rubric
        </Label>
        <div className="text-sm text-muted-foreground mb-4 flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5" />
          <p>
            Select criteria to include in your rubric. Each criterion will be evaluated using 
            fuzzy logic with bisector method defuzzification for accurate assessment.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="rubricItems"
          render={() => (
            <div>
              <Label className="mb-2 block">Standard Criteria</Label>
              <div className="flex flex-wrap gap-2">
                {defaultItems.map((item) => (
                  <Badge
                    key={item}
                    variant={selectedItems.includes(item) ? "default" : "outline"}
                    className="cursor-pointer transition-all"
                    onClick={() => toggleItem(item)}
                  >
                    {selectedItems.includes(item) && <Check className="mr-1 h-3 w-3" />}
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        />

        <div>
          <Label className="mb-2 block">Custom Criteria</Label>
          <div className="flex items-center space-x-2 mb-3">
            <Input
              placeholder="Add custom rubric item..."
              value={customItem}
              onChange={(e) => setCustomItem(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
            />
            <Button type="button" onClick={addCustomItem} size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          {customItems.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {customItems.map((item) => (
                <Badge
                  key={item}
                  variant={selectedItems.includes(item) ? "default" : "outline"}
                  className="cursor-pointer transition-all"
                >
                  <span onClick={() => toggleItem(item)} className="flex items-center">
                    {selectedItems.includes(item) && <Check className="mr-1 h-3 w-3" />}
                    {item}
                  </span>
                  <button
                    type="button"
                    className="ml-1 hover:text-destructive focus:outline-none"
                    onClick={() => removeCustomItem(item)}
                  >
                    <Trash className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {rubricItems.length > 0 && (
          <div>
            <Label className="mb-2 block">Weight Distribution</Label>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {rubricItems.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm font-mono">{item.weight}%</span>
                      </div>
                      <Slider
                        defaultValue={[item.weight]}
                        min={5}
                        max={50}
                        step={5}
                        onValueChange={(values) => updateItemWeight(index, values[0])}
                      />
                    </div>
                  ))}
                  
                  <div className="pt-2 flex justify-between text-sm">
                    <span className="text-muted-foreground">Total weight:</span>
                    <span 
                      className={
                        `font-medium ${
                          rubricItems.reduce((sum, item) => sum + item.weight, 0) === 100 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-amber-600 dark:text-amber-400'
                        }`
                      }
                    >
                      {rubricItems.reduce((sum, item) => sum + item.weight, 0)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            {rubricItems.reduce((sum, item) => sum + item.weight, 0) !== 100 && (
              <div className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                <Info className="h-3 w-3 inline mr-1" />
                Ideally, weights should sum to 100%.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentRubricFields;
