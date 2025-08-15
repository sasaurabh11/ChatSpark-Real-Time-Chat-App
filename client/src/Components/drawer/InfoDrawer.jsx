import { Drawer } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Profile from './Profile';

function InfoDrawer({ open, setOpen }) {
  const handleCloseDrawer = () => {
    setOpen(false);
  };

  return (
    <Drawer
      open={open}
      onClose={handleCloseDrawer}
      PaperProps={{
        sx: {
          width: '380px',
          height: '100vh',
          boxShadow: 'xl',
          backgroundColor: 'rgb(31, 41, 55)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'absolute',
          left: '20px',
          top: '18px'
        }
      }}
      style={{ zIndex: 1500 }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="bg-indigo-700 px-4 py-6 flex items-center space-x-4">
          <button 
            onClick={handleCloseDrawer}
            className="p-2 rounded-full hover:bg-indigo-600 transition-colors"
          >
            <ArrowBack className="text-white" />
          </button>
          <h2 className="text-xl font-semibold text-white">Profile</h2>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <Profile />
        </div>
      </div>
    </Drawer>
  );
}

export default InfoDrawer;