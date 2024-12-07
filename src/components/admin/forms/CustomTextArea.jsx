import React from "react";

function CustomTextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  className = "",
  formatButtons = true,
}) {
  const handleFormat = (tag) => {
    const textarea = document.querySelector(`textarea[name="${name}"]`);
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let formattedText = "";
    switch (tag) {
      case "title":
        formattedText = `<div class="font-bold text-2xl mt-2">${selectedText}</div>`;
        break;
      default:
        formattedText = selectedText;
    }

    const newText =
      value.substring(0, start) + formattedText + value.substring(end);

    onChange({ target: { name, value: newText } });
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block mb-2 font-medium">{label}:</label>}
      <div className="border border-gray-300 rounded">
        {formatButtons && (
          <div className="flex gap-2 p-2 border-b border-gray-300 bg-gray-50">
            <button
              type="button"
              onClick={() => handleFormat("title")}
              className="px-3 py-1 border rounded hover:bg-gray-200 font-bold"
            >
              Tiêu đề
            </button>
          </div>
        )}
        <textarea
          name={name}
          className="w-full p-2 min-h-[200px] outline-none"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export default CustomTextArea;
