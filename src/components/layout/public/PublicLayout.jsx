import { Outlet } from 'react-router-dom';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';
import AISupportWidget from '../../ui/AISupportWidget';

const PublicLayout = () => {
  return (
    <>
      <PublicNavbar />
      <Outlet />
      <PublicFooter />
      <AISupportWidget />
    </>
  );
};

export default PublicLayout;
