import { useTheme } from "@/hooks/theme";
const ToggleTheme = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div>
      <button onClick={() => toggleDarkMode()}>
        <i
          className={
            darkMode
              ? "bi bi-moon-fill text-gray-300 hover:text-white px-3 py-2"
              : `bi bi-sun text-gray-400 px-3 py-2 hover:text-gray-600`
          }
          style={{ fontSize: "1.25rem" }}
        ></i>
      </button>
    </div>
  );
};
export default ToggleTheme;
