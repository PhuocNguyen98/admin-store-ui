import { useEffect, useCallback } from 'react';
import { useController } from 'react-hook-form';

import { useDropzone } from 'react-dropzone';

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
  files,
  setFiles,
  ...props
}) {
  const { field } = useController({ control, name });

  const onDrop = useCallback((acceptedFiles) => {
    const newAcceptedFiles = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );
    if (multiple) {
      setFiles((prevFiles) => [...prevFiles, ...newAcceptedFiles]);
    } else {
      setFiles(newAcceptedFiles);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept,
    multiple: multiple,
    maxSize: maxSize,
    props,
  });

  useEffect(() => {
    field.onChange(files);
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => {
      if (files.length > 0) files.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [files]);

  const removeThumb = (file) => {
    const newFiles = files.filter((item) => {
      if (item?.name) {
        return item.name !== file.name;
      } else {
        return item !== file;
      }
    });
    setFiles(newFiles);
  };

  return (
    <>
      <div className={cx('wrapper')}>
        <section className={cx('inner')}>
          <div {...getRootProps({ className: cx('dropzone') })}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className={cx('desc')}>Drop the files here ...</p>
            ) : (
              <p className={cx('desc')}>
                Drag drop {multiple ? 'some' : '1'} files here, or click to select files <br />
                {multiple && (
                  <strong className={cx('note')} style={{ display: 'block', textAlign: 'center' }}>
                    Unlimited number of files
                  </strong>
                )}
              </p>
            )}
          </div>
          <h4 className={cx('title')}>Image</h4>
          {files.length > 0 && (
            <aside className={cx('thumbs-list')}>
              {files.map((file, index) =>
                file ? (
                  <div key={index} className={cx('thumb-item')}>
                    <img
                      src={file?.preview ? file.preview : file}
                      alt=''
                      className={cx('thumb-img')}
                      onLoad={() => {
                        URL.revokeObjectURL(file);
                      }}
                    />
                    <span className={cx('thumb-detele')} onClick={() => removeThumb(file)}>
                      &times;
                    </span>
                  </div>
                ) : null,
              )}
            </aside>
          )}
        </section>
      </div>
    </>
  );
}

export default DropzoneStyle;
