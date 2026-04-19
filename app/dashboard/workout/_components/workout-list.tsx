'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Dumbbell, Plus, Trash2, ChevronDown, ChevronUp, CheckCircle2, Circle, Edit2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addExercise, addSet, deleteWorkout, deleteExercise, deleteSet, toggleExerciseCompletion, updateSet } from '../actions';
import toast from 'react-hot-toast';

export function WorkoutList({ workouts }: { workouts: any[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (workouts.length === 0) {
    return (
      <div className="text-center py-20">
        <Dumbbell className="w-16 h-16 text-gray-800 mx-auto mb-4" />
        <h3 className="font-press-start text-gray-500 text-sm">NENHUM TREINO REGISTRADO</h3>
        <p className="text-gray-600 mt-2 font-vt323 text-2xl">ACEITE UMA MISSÃO DE FORÇA PARA COMEÇAR.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {workouts.map((workout) => (
        <WorkoutCard 
          key={workout.id} 
          workout={workout} 
          isExpanded={expandedId === workout.id}
          onToggle={() => setExpandedId(expandedId === workout.id ? null : workout.id)}
        />
      ))}
    </div>
  );
}

function WorkoutCard({ workout, isExpanded, onToggle }: { workout: any, isExpanded: boolean, onToggle: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Deseja excluir este treino?')) return;
    setIsDeleting(true);
    try {
      await deleteWorkout(workout.id);
      toast.success('Treino removido!');
    } catch (err) {
      toast.error('Erro ao deletar treino');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-[1px] pixel-corners bg-[#222] hover:bg-[#333] transition-colors">
      <div className="pixel-corners bg-[#111] overflow-hidden">
        {/* Header */}
        <div 
          className="p-6 flex items-center justify-between cursor-pointer group"
          onClick={onToggle}
        >
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-[#18181b] border-2 border-[#222] pixel-corners flex items-center justify-center text-[#ff6b6b]">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-press-start text-xs text-white uppercase group-hover:text-[#ff6b6b] transition-colors">
                {workout.name}
              </h3>
              <p className="text-gray-500 font-vt323 text-xl">
                {format(new Date(workout.date), "dd 'de' MMMM", { locale: ptBR })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-vt323 text-xl text-gray-600">
              {workout.exercises.length} EXERCÍCIOS
            </span>
            <button 
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              className="p-2 text-gray-700 hover:text-red-500 transition-colors"
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {isExpanded ? <ChevronUp className="w-6 h-6 text-gray-600" /> : <ChevronDown className="w-6 h-6 text-gray-600" />}
          </div>
        </div>

        {/* Exercises Content */}
        {isExpanded && (
          <div className="p-6 pt-0 border-t border-[#222] bg-white/[0.01] animate-in slide-in-from-top-4 duration-300">
            <div className="space-y-8 mt-6">
              {workout.exercises.map((exercise: any) => (
                <ExerciseItem key={exercise.id} exercise={exercise} workoutId={workout.id} />
              ))}
              <AddExerciseInput workoutId={workout.id} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ExerciseItem({ exercise, workoutId }: { exercise: any, workoutId: string }) {
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      await toggleExerciseCompletion(exercise.id, !exercise.isCompleted);
      toast.success(exercise.isCompleted ? 'Exercício reaberto' : 'Exercício concluído!');
    } catch (err) {
      toast.error('Erro ao atualizar');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Excluir exercício?')) return;
    try {
      await deleteExercise(exercise.id);
      toast.success('Exercício removido');
    } catch (err) {
      toast.error('Erro ao remover');
    }
  };

  return (
    <div className={cn("space-y-4 p-4 pixel-corners border-2 border-transparent transition-colors", exercise.isCompleted ? "bg-green-500/5 border-green-500/10" : "bg-[#18181b]/50")}>
      <div className="flex items-center justify-between border-l-4 border-[#ff6b6b] pl-4">
        <div className="flex items-center gap-4">
           <button 
             onClick={handleToggleComplete}
             disabled={loading}
             className={cn("p-1 pixel-corners transition-all", exercise.isCompleted ? "text-green-500" : "text-gray-700 hover:text-white")}
           >
             {exercise.isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
           </button>
           <div>
             <h4 className={cn("font-press-start text-[10px] uppercase", exercise.isCompleted ? "text-green-500 line-through opacity-50" : "text-white")}>
               {exercise.name}
             </h4>
             <span className="text-gray-600 font-vt323 text-lg">{exercise.sets.length} SÉRIES REGISTRADAS</span>
           </div>
        </div>
        <button onClick={handleDelete} className="p-2 text-gray-800 hover:text-red-500 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {exercise.sets.map((set: any, index: number) => (
          <SetItem key={set.id} set={set} index={index} />
        ))}
        {!exercise.isCompleted && <AddSetButton exerciseId={exercise.id} />}
      </div>
    </div>
  );
}

function SetItem({ set, index }: { set: any, index: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [reps, setReps] = useState(set.reps || 0);
  const [weight, setWeight] = useState(set.weight || 0);

  const handleUpdate = async () => {
    try {
      await updateSet(set.id, reps, weight);
      setIsEditing(false);
      toast.success('Série atualizada');
    } catch (err) {
      toast.error('Erro ao salvar');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Remover esta série?')) return;
    try {
      await deleteSet(set.id);
      toast.success('Série removida');
    } catch (err) {
      toast.error('Erro ao remover');
    }
  };

  return (
    <div className="p-4 bg-[#111] border border-[#222] pixel-corners flex items-center justify-between group relative">
       <div className="flex items-center gap-3 w-full">
          <span className="font-vt323 text-gray-600">#{index + 1}</span>
          {isEditing ? (
            <div className="flex items-center gap-2 w-full">
              <input 
                type="number" 
                value={weight} 
                onChange={(e) => setWeight(parseFloat(e.target.value))} 
                className="w-12 bg-black border border-[#333] text-white font-press-start text-[8px] p-1 outline-none focus:border-[#ff6b6b]"
                placeholder="kg"
              />
              <span className="text-gray-600 text-[8px]">kg x</span>
              <input 
                type="number" 
                value={reps} 
                onChange={(e) => setReps(parseInt(e.target.value))} 
                className="w-12 bg-black border border-[#333] text-white font-press-start text-[8px] p-1 outline-none focus:border-[#ff6b6b]"
                placeholder="reps"
              />
              <button onClick={handleUpdate} className="text-green-500 hover:scale-110">
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span className="font-press-start text-[8px] text-white truncate">
              {set.weight ? `${set.weight}KG` : '--'} x {set.reps}
            </span>
          )}
       </div>
       
       {!isEditing && (
         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
           <button onClick={() => setIsEditing(true)} className="text-gray-600 hover:text-blue-400">
             <Edit2 className="w-3 h-3" />
           </button>
           <button onClick={handleDelete} className="text-gray-600 hover:text-red-500">
             <Trash2 className="w-3 h-3" />
           </button>
         </div>
       )}
    </div>
  );
}

function AddExerciseInput({ workoutId }: { workoutId: string }) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || loading) return;
    setLoading(true);
    try {
      await addExercise(workoutId, name);
      setName('');
      toast.success('Exercício adicionado!');
    } catch (err) {
      toast.error('Erro ao adicionar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdd} className="flex gap-4">
      <input 
        type="text"
        placeholder="ADICIONAR NOVO EXERCÍCIO..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 bg-[#111] border-2 border-[#222] p-4 font-vt323 text-xl text-white outline-none focus:border-[#ff6b6b] transition-colors pixel-corners"
      />
      <button 
        type="submit"
        disabled={loading}
        className="px-8 bg-[#ff6b6b] hover:bg-[#ff8b8b] text-white font-press-start text-[10px] pixel-corners shadow-[inset_-4px_-4px_0px_rgba(0,0,0,0.3)] transition-all"
      >
        {loading ? '...' : 'ADICIONAR'}
      </button>
    </form>
  );
}

function AddSetButton({ exerciseId }: { exerciseId: string }) {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const repsStr = prompt('Repetições (obrigatório):');
    if (!repsStr) return;
    
    const weightStr = prompt('Peso (kg) - Deixe em branco para peso do corpo:');
    
    setLoading(true);
    try {
      await addSet(
        exerciseId, 
        parseInt(repsStr), 
        weightStr ? parseFloat(weightStr) : undefined
      );
      toast.success('Série registrada!');
    } catch (err) {
      toast.error('Erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleAdd}
      disabled={loading}
      className="p-4 border-2 border-dashed border-[#222] hover:border-[#ff6b6b]/50 hover:bg-[#ff6b6b]/5 text-gray-500 hover:text-[#ff6b6b] transition-all flex items-center justify-center gap-2 pixel-corners"
    >
      <Plus className="w-4 h-4" />
      <span className="font-press-start text-[8px]">NOVA SÉRIE</span>
    </button>
  );
}
