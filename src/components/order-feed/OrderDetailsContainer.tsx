import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../store';
import OrderDetailsModal from './OrderDetailsModal';
import { FeedOrder } from '../../features/feedSlice';
import OrderDetailsSkeleton from './OrderDetailsSkeleton';

const fetchOrderByNumber = async (number: string): Promise<FeedOrder | null> => {
  try {
    const res = await fetch(`https://norma.nomoreparties.space/api/orders/${number}`);
    const data = await res.json();
    if (data.success && data.orders && data.orders.length > 0) {
      return data.orders[0];
    }
    return null;
  } catch {
    return null;
  }
};

interface Props {
  onClose?: () => void;
  source?: 'feed' | 'profileOrders';
}

const OrderDetailsContainer: React.FC<Props> = ({ onClose, source = 'feed' }) => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;

  const orderFromStore = useAppSelector((state) => {
    if (source === 'feed') {
      return state.feed.orders.find((o) => o.number === Number(number));
    } else {
      return state.profileOrders.orders.find((o) => o.number === Number(number));
    }
  });

  const [order, setOrder] = useState<FeedOrder | null | undefined>(orderFromStore);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderFromStore && number) {
      setLoading(true);
      fetchOrderByNumber(number).then((fetched) => {
        setOrder(fetched);
        setLoading(false);
      });
    } else {
      setOrder(orderFromStore);
    }
  }, [number, orderFromStore]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else if (background) {
      navigate(background.pathname, { replace: true });
    } else {
      navigate(source === 'feed' ? '/feed' : '/profile/orders');
    }
  };

  if (loading) return <OrderDetailsSkeleton />;
  return <OrderDetailsModal order={order} onClose={handleClose} />;
};

export default OrderDetailsContainer; 