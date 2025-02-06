import React from "react";
import MarkdownIt from "markdown-it";
import ReactMarkdownEditorLite from "react-markdown-editor-lite";

// Khởi tạo markdown-it (markdown parser)
const mdParser = new MarkdownIt();

function CustomTextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  className = "",
}) {
  const handleEditorChange = ({ text }) => {
    // Cập nhật giá trị khi nội dung markdown thay đổi
    onChange({ target: { name, value: text } });
  };

  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="block mb-2 font-medium">{label}:</label>}
      <div className="border border-gray-300 rounded">
        {/* Markdown editor */}
        <ReactMarkdownEditorLite
          value={value}
          style={{ height: "400px" }}
          renderHTML={(text) => mdParser.render(text)} // Dùng markdown-it để render HTML
          onChange={handleEditorChange} // Cập nhật giá trị khi thay đổi
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export default CustomTextArea;
