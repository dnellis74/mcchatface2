import { FC } from "react";

interface Props {
  onReset: () => void;
}

export const ResetChat: FC<Props> = ({ onReset }) => {
  return (
    <div className="flex flex-row items-center">
      <button
        className="text-white bg-black px-4 py-2 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-800 reset-button"
        onClick={() => onReset()}
      >
        Reset
      </button>
    </div>
  );
};
;