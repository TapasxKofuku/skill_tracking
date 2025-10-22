"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence

interface Skill {
  id: number;
  name: string;
  level: number;
}

export default function Home() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(1);
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
  const [editedSkillName, setEditedSkillName] = useState('');
  const [editedSkillLevel, setEditedSkillLevel] = useState(1);

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    const response = await fetch('/api/skills');
    const data = await response.json();
    setSkills(data);
  };

  const addSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/skills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newSkillName, level: newSkillLevel }),
    });
    const newSkill = await response.json();
    console.log('newSkill from server:', newSkill);
    setSkills([...skills, newSkill]);
    setNewSkillName('');
    setNewSkillLevel(1);
  };

  const deleteSkill = async (id: number) => {
    await fetch(`/api/skills/${id}`, {
      method: 'DELETE',
    });
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const updateSkillLevel = async (id: number, level: number) => {
    if (level < 1 || level > 10) return;
    const response = await fetch(`/api/skills/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ level }),
    });
    const updatedSkill = await response.json();
    setSkills(skills.map(skill => (skill.id === id ? updatedSkill : skill)));
  };

  const startEditing = (skill: Skill) => {
    setEditingSkillId(skill.id);
    setEditedSkillName(skill.name);
    setEditedSkillLevel(skill.level);
  };

  const saveEditedSkill = async (id: number) => {
    const response = await fetch(`/api/skills/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: editedSkillName, level: editedSkillLevel }),
    });
    const updatedSkill = await response.json();
    setSkills(skills.map(skill => (skill.id === id ? updatedSkill : skill)));
    setEditingSkillId(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center gap-8 py-12 px-4 md:px-8 bg-white dark:bg-black">

        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50">Skill Tracker</h1>

        <form onSubmit={addSkill} className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Skill name"
            className="h-12 px-4 w-full rounded-md border border-solid border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black text-black dark:text-white"
            required
          />
          <input
            type="number"
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(parseInt(e.target.value))}
            min="1"
            max="10"
            className="h-12 px-4 w-full sm:w-24 rounded-md border border-solid border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black text-black dark:text-white"
            required
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Add Skill
          </motion.button>
        </form>

        <div className="w-full max-w-md">
          <AnimatePresence>
            <motion.ul layout className="flex flex-col gap-4">
              {skills.map(skill => (
                <motion.li
                  key={skill.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between p-4 rounded-md border border-solid border-black/[.08] dark:border-white/[.145]"
                >
                  {editingSkillId === skill.id ? (
                    <div className="flex flex-grow items-center gap-2">
                      <input
                        type="text"
                        value={editedSkillName}
                        onChange={(e) => setEditedSkillName(e.target.value)}
                        className="h-10 px-2 flex-grow rounded-md border border-solid border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black text-black dark:text-white"
                      />
                      <input
                        type="number"
                        value={editedSkillLevel}
                        onChange={(e) => setEditedSkillLevel(parseInt(e.target.value))}
                        min="1"
                        max="10"
                        className="h-10 px-2 w-16 rounded-md border border-solid border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black text-black dark:text-white"
                      />
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => saveEditedSkill(skill.id)} className="flex h-10 w-16 items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600">Save</motion.button>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setEditingSkillId(null)} className="flex h-10 w-16 items-center justify-center rounded-full bg-gray-300 text-black transition-colors hover:bg-gray-400">Cancel</motion.button>
                    </div>
                  ) : (
                    <>
                      <span className="text-lg font-medium text-black dark:text-zinc-50">{skill.name}</span>
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateSkillLevel(skill.id, skill.level - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-foreground transition-colors hover:bg-foreground/20"
                        >
                          -
                        </motion.button>
                        <span className="text-lg font-bold text-black dark:text-zinc-50">{skill.level}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateSkillLevel(skill.id, skill.level + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground/10 text-foreground transition-colors hover:bg-foreground/20"
                        >
                          +
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => startEditing(skill)} className="flex h-8 w-16 items-center justify-center rounded-full bg-yellow-500 text-white transition-colors hover:bg-yellow-600">Edit</motion.button>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => deleteSkill(skill.id)} className="flex h-8 w-20 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600">Delete</motion.button>
                      </div>
                    </>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}