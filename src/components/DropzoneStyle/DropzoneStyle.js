import { useDropzone } from 'react-dropzone';
import { useController } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';
import classnames from 'classnames/bind';
import styles from './DropzoneStyle.module.scss';

const cx = classnames.bind(styles);

function DropzoneStyle({
  control,
  name,
  accept = {
    'image/png': ['.png', '.jpg'],
  },
  multiple = false,
  maxSize = 5242880, // 5MB
  ...props
}) {
  const { field } = useController({ control, name });
  const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    field.onChange(acceptedFiles);
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept,
    multiple: multiple,
    maxSize: maxSize,
    props,
  });

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach((file) => URL.revokeObjectURL(file));
  }, []);

  const removeThumb = (file) => {
    setFiles((prevFiles) =>
      prevFiles.filter((item) => item.name !== file.name),
    );
  };

  return (
    <div className={cx('wrapper')}>
      <section className={cx('inner')}>
        <div {...getRootProps({ className: cx('dropzone') })}>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className={cx('desc')}>Drop the files here ...</p>
          ) : (
            <p className={cx('desc')}>
              Drag drop {multiple ? 'some' : '1'} files here, or click to select
              files <br />
              {multiple && (
                <strong
                  className={cx('note')}
                  style={{ display: 'block', textAlign: 'center' }}
                >
                  Unlimited number of files
                </strong>
              )}
            </p>
          )}
        </div>
        <h4 className={cx('title')}>Image</h4>
        {files.length > 0 && (
          <aside className={cx('thumbs-list')}>
            {files.map((file, index) => (
              <div key={index} className={cx('thumb-item')}>
                <img
                  src={`${URL.createObjectURL(file)}`}
                  alt=''
                  className={cx('thumb-img')}
                  onLoad={() => {
                    URL.revokeObjectURL(file);
                  }}
                />
                <span
                  className={cx('thumb-detele')}
                  onClick={() => removeThumb(file)}
                >
                  &times;
                </span>
              </div>
            ))}
          </aside>
        )}
      </section>
    </div>
  );
}

export default DropzoneStyle;
