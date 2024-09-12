import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Undo,
  Alignment,
  ClassicEditor,
  Autoformat,
  Bold,
  Italic,
  Underline,
  BlockQuote,
  Base64UploadAdapter,
  CloudServices,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  PictureEditing,
  Indent,
  IndentBlock,
  Link,
  List,
  MediaEmbed,
  Mention,
  Paragraph,
  PasteFromOffice,
  Table,
  TableColumnResize,
  TableToolbar,
  TextTransformation,
  TodoList,
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

import { useController } from 'react-hook-form';
import { useEffect } from 'react';

function CKEditorStyle({ control, name, textValue, setTextValue }) {
  const { field } = useController({ control, name });

  const handleChange = (e, editor) => {
    const data = editor.getData();
    setTextValue(data);
  };

  useEffect(() => {
    field.onChange(textValue);
  }, [textValue]);

  return (
    <>
      <CKEditor
        data={textValue}
        onChange={(e, editor) => handleChange(e, editor)}
        editor={ClassicEditor}
        config={{
          toolbar: {
            items: [
              'undo',
              'redo',
              '|',
              'heading',
              '|',
              'bold',
              'italic',
              'underline',
              '|',
              'link',
              'uploadImage',
              'insertTable',
              'blockQuote',
              'mediaEmbed',
              '|',
              'alignment',
              '|',
              'bulletedList',
              'numberedList',
              'todoList',
              '|',
              'outdent',
              'indent',
            ],
          },
          plugins: [
            Undo,
            Alignment,
            Autoformat,
            BlockQuote,
            Bold,
            CloudServices,
            Essentials,
            Heading,
            Image,
            ImageCaption,
            ImageResize,
            ImageStyle,
            ImageToolbar,
            ImageUpload,
            Base64UploadAdapter,
            Indent,
            IndentBlock,
            Italic,
            Link,
            List,
            MediaEmbed,
            Mention,
            Paragraph,
            PasteFromOffice,
            PictureEditing,
            Table,
            TableColumnResize,
            TableToolbar,
            TextTransformation,
            Underline,
            TodoList,
          ],
          heading: {
            options: [
              {
                model: 'paragraph',
                title: 'Paragraph',
                class: 'ck-heading_paragraph',
              },
              {
                model: 'heading1',
                view: 'h1',
                title: 'Heading 1',
                class: 'ck-heading_heading1',
              },
              {
                model: 'heading2',
                view: 'h2',
                title: 'Heading 2',
                class: 'ck-heading_heading2',
              },
              {
                model: 'heading3',
                view: 'h3',
                title: 'Heading 3',
                class: 'ck-heading_heading3',
              },
              {
                model: 'heading4',
                view: 'h4',
                title: 'Heading 4',
                class: 'ck-heading_heading4',
              },
            ],
          },
          image: {
            resizeOptions: [
              {
                name: 'resizeImage:original',
                label: 'Default image width',
                value: null,
              },
              {
                name: 'resizeImage:50',
                label: '50% page width',
                value: '50',
              },
              {
                name: 'resizeImage:75',
                label: '75% page width',
                value: '75',
              },
            ],
            toolbar: [
              'imageTextAlternative',
              'toggleImageCaption',
              '|',
              'imageStyle:inline',
              'imageStyle:wrapText',
              'imageStyle:breakText',
              '|',
              'resizeImage',
            ],
          },
          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
          },
          table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
          },
          initialData: '',
        }}
      />
    </>
  );
}

export default CKEditorStyle;
