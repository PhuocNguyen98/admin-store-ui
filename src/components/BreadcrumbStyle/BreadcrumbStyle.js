import { Link, useLocation } from 'react-router-dom';
import classname from 'classnames/bind';
import styles from './BreadcrumbStyle.module.scss';
import config from '~/config';

const cx = classname.bind(styles);

function BreadcrumbStyle() {
  const location = useLocation();
  const pathNames = location.pathname.split('/').filter((x) => x);
  let breadcrumbPath = '';

  return (
    <div className={cx('wrapper')}>
      <Link to={config.routes.dashboard} className={cx('item', 'link')}>
        Dashboard
      </Link>
      {pathNames.map((path, index) => {
        breadcrumbPath += `/${path}`;
        const isLastPath = index === pathNames.length - 1;
        return isLastPath ? (
          <span key={index} className={cx('item')}>
            &nbsp;/ {path}
          </span>
        ) : (
          <span key={index}>
            {' '}
            /{' '}
            <Link to={breadcrumbPath} className={cx('item', 'link')}>
              {path}
            </Link>
          </span>
        );
      })}
    </div>
  );
}

export default BreadcrumbStyle;
