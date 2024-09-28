import { XIcon } from "lucide-react";
import { LoadingDialog } from "./Dialog";

const CustomModal = ({
  onClose,
  title = "Sample",
  topComponent,
  bodyComponent,
  buttonText = "OK",
  onButtonClick,
  loading,
}: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          <XIcon size={30} />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          {title}
        </h2>
        {topComponent && (
          <div className="flex justify-center mb-6">{topComponent}</div>
        )}
        <div className="max-h-96 overflow-y-auto pr-2">{bodyComponent}</div>
        <div className="mt-6">
          <button
            onClick={onButtonClick}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            {buttonText}
          </button>
        </div>
      </div>
      <LoadingDialog isVisible={loading} />
    </div>
  );
};

export default CustomModal;
