import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useEnvStore = create(
  persist(
    (set, get) => ({
      environments: [
        {
          id: "1",
          name: "Development",
          variables: [
            { key: "BASE_URL", value: "https://jsonplaceholder.typicode.com" },
          ],
        },
        {
          id: "2",
          name: "Production",
          variables: [{ key: "BASE_URL", value: "https://api.example.com" }],
        },
      ],
      activeEnvId: "1",

      setActiveEnv: (id) => set({ activeEnvId: id }),

      addEnvironment: (env) =>
        set((state) => ({
          environments: [
            ...state.environments,
            { ...env, id: crypto.randomUUID() },
          ],
        })),

      updateEnvironment: (id, updates) =>
        set((state) => ({
          environments: state.environments.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),

      deleteEnvironment: (id) =>
        set((state) => ({
          environments: state.environments.filter((e) => e.id !== id),
          activeEnvId: state.activeEnvId === id ? null : state.activeEnvId,
        })),

      getVariableValue: (key) => {
        const { environments, activeEnvId } = get();
        const activeEnv = environments.find((e) => e.id === activeEnvId);
        if (!activeEnv) return null;
        const variable = activeEnv.variables.find((v) => v.key === key);
        return variable ? variable.value : null;
      },
    }),
    {
      name: "api-playground-env-storage",
    }
  )
);
