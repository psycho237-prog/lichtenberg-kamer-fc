import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, label }) => {
    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'font': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }],
            ['link'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font',
        'bold', 'italic', 'underline', 'strike',
        'list',
        'color', 'background',
        'align',
        'link'
    ];

    const handleEditorChange = (content, delta, source, editor) => {
        if (value !== content) {
            onChange(content);
        }
    };

    return (
        <div className="mb-6">
            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-2 block">{label}</label>
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <ReactQuill
                    theme="snow"
                    value={value || ''}
                    onChange={handleEditorChange}
                    modules={modules}
                    formats={formats}
                    className="text-white bg-transparent"
                />
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                .ql-toolbar.ql-snow {
                    border: none !important;
                    background: rgba(255, 255, 255, 0.05);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                }
                .ql-container.ql-snow {
                    border: none !important;
                    min-height: 200px;
                }
                .ql-editor {
                    font-size: 14px;
                    line-height: 1.6;
                    color: white;
                }
                .ql-editor.ql-blank::before {
                    color: rgba(255, 255, 255, 0.3) !important;
                }
                .ql-snow .ql-stroke {
                    stroke: #9ca3af !important;
                }
                .ql-snow .ql-fill {
                    fill: #9ca3af !important;
                }
                .ql-snow .ql-picker {
                    color: #9ca3af !important;
                }
                .ql-snow .ql-picker-options {
                    background-color: #1a1a1a !important;
                    border: 1px solid rgba(255, 255, 255, 0.1) !important;
                }
                .ql-snow .ql-active .ql-stroke,
                .ql-snow .ql-picker-label.ql-active {
                    stroke: #1B5BA6 !important;
                    color: #1B5BA6 !important;
                }
            `}} />
        </div>
    );
};

export default RichTextEditor;
