import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Plus, GripVertical } from 'lucide-react';
import { mockHabits } from '../data/mock';

const HabitChain = () => {
  const [habits, setHabits] = useState(mockHabits);
  const [newHabit, setNewHabit] = useState('');
  const [draggedIndex, setDraggedIndex] = useState(null);

  const addHabit = () => {
    if (newHabit.trim()) {
      const habit = {
        id: Date.now(),
        name: newHabit.trim()
      };
      setHabits([...habits, habit]);
      setNewHabit('');
    }
  };

  const removeHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newHabits = [...habits];
    const draggedHabit = newHabits[draggedIndex];
    
    // Remove dragged item
    newHabits.splice(draggedIndex, 1);
    
    // Insert at new position
    newHabits.splice(dropIndex, 0, draggedHabit);
    
    setHabits(newHabits);
    setDraggedIndex(null);
  };

  const formatChainText = () => {
    if (habits.length === 0) return "Start building your habit chain...";
    if (habits.length === 1) return `I ${habits[0].name}`;
    
    let text = "";
    habits.forEach((habit, index) => {
      if (index === 0) {
        text += `I ${habit.name}`;
      } else if (index === habits.length - 1) {
        text += `, then I ${habit.name}`;
      } else {
        text += `, then I ${habit.name}`;
      }
    });
    return text + ".";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Habit Stack Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create powerful habit chains by linking new habits to existing routines. 
            Build your perfect day, one habit at a time.
          </p>
        </div>

        {/* Chain Display */}
        <Card className="mb-8 p-8 shadow-lg bg-white/80 backdrop-blur-sm border-0">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Habit Chain</h2>
            <div className="text-lg leading-relaxed text-gray-700 min-h-[60px] flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-indigo-500">
              <p className="text-xl font-medium">{formatChainText()}</p>
            </div>
          </div>
        </Card>

        {/* Add New Habit */}
        <Card className="mb-8 p-6 shadow-lg bg-white/80 backdrop-blur-sm border-0">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Habit</h3>
          <div className="flex gap-3">
            <Input
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="e.g., brush my teeth, do 10 pushups, make coffee..."
              className="flex-1 text-lg py-3 px-4 border-2 border-gray-200 focus:border-indigo-500 transition-colors"
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
            />
            <Button 
              onClick={addHabit}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Habit
            </Button>
          </div>
        </Card>

        {/* Habit List with Drag & Drop */}
        {habits.length > 0 && (
          <Card className="p-6 shadow-lg bg-white/80 backdrop-blur-sm border-0">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Reorder Your Habits (Drag & Drop)
            </h3>
            <div className="space-y-3">
              {habits.map((habit, index) => (
                <div
                  key={habit.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg border-2 border-gray-100 hover:border-indigo-300 transition-all duration-200 cursor-move hover:shadow-md group"
                >
                  <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  <div className="flex items-center gap-3 flex-1">
                    <span className="bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full">
                      {index + 1}
                    </span>
                    <span className="text-lg text-gray-700">
                      {index === 0 ? 'I ' : 'Then I '}
                      <span className="font-medium">{habit.name}</span>
                    </span>
                  </div>
                  <Button
                    onClick={() => removeHabit(habit.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {habits.length === 0 && (
          <Card className="p-12 text-center shadow-lg bg-white/80 backdrop-blur-sm border-0">
            <div className="text-gray-500">
              <h3 className="text-xl font-medium mb-2">No habits yet</h3>
              <p>Start building your habit chain by adding your first habit above.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HabitChain;