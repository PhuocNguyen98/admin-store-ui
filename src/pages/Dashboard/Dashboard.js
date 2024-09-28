import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import { useSelector } from 'react-redux';

function Dashboard() {
  const user = useSelector((state) => state.user);

  return (
    <div>
      <em style={{ lineHeight: '1.6rem' }}>
        Welcome, {Object.keys(user.data).length > 0 ? user.data?.username : ''}. Have a nice day{' '}
        <SentimentSatisfiedAltIcon />!
      </em>
    </div>
  );
}

export default Dashboard;
