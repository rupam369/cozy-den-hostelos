import { MealSchedule, MealType } from '@/types';

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export const INITIAL_MEALS: MealSchedule[] = [
  {
    id: 'meal-1',
    meal_type: 'Breakfast',
    start_time: '9:00 AM',
    end_time: '9:30 AM',
    title: 'Sunrise Energizer Feast',
    menu_items: ['Masala Dosa with Drumstick Sambar', 'Steamed Fluffy Idlis', 'Boiled Eggs', 'Fresh Papaya & Melon', 'South Indian Filter Coffee'],
    chef_special: 'Crispy Ghee Podi Dosa',
    calories: 490,
  },
  {
    id: 'meal-2',
    meal_type: 'Lunch',
    start_time: '1:00 PM',
    end_time: '2:00 PM',
    title: 'Chef Special Grand Thali',
    menu_items: ['Paneer Makhani', 'Dal Tadka', 'Jeera Pea Pulao', 'Hot Butter Naan', 'Cucumber Mint Raita', 'Warm Gulab Jamun'],
    chef_special: 'Shahi Mughlai Paneer Tikka',
    calories: 740,
  },
  {
    id: 'meal-3',
    meal_type: 'High Tea',
    start_time: '6:00 PM',
    end_time: '6:30 PM',
    title: 'Golden Sunset Brew & Snacks',
    menu_items: ['Crispy Onion & Spinach Pakoras', 'Spiced Potato Samosa', 'Mint Tamarind Chutneys', 'Adrak Elaichi Kadak Chai'],
    chef_special: 'Crispy Paneer Bread Cutlet',
    calories: 320,
  },
  {
    id: 'meal-4',
    meal_type: 'Dinner',
    start_time: '8:00 PM',
    end_time: '9:00 PM',
    title: 'Night Comfort Dining',
    menu_items: ['Kadai Paneer', 'Yellow Dal Fry', 'Warm Phulkas with Ghee', 'Fragrant Steamed Rice', 'Kheer / Moong Dal Halwa'],
    chef_special: 'Smoky Charcoal Tandoori Roti',
    calories: 660,
  },
];

export function getCurrentMealStatus(): { current: MealType; status: 'active' | 'upcoming'; nextTime: string } {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Breakfast: 9:00 (540) - 9:30 (570)
  // Lunch: 13:00 (780) - 14:00 (840)
  // High Tea: 18:00 (1080) - 18:30 (1110)
  // Dinner: 20:00 (1200) - 21:00 (1260)

  if (currentMinutes >= 540 && currentMinutes <= 570) {
    return { current: 'Breakfast', status: 'active', nextTime: 'Ends at 9:30 AM' };
  } else if (currentMinutes < 540) {
    return { current: 'Breakfast', status: 'upcoming', nextTime: 'Starts at 9:00 AM' };
  } else if (currentMinutes >= 780 && currentMinutes <= 840) {
    return { current: 'Lunch', status: 'active', nextTime: 'Ends at 2:00 PM' };
  } else if (currentMinutes < 780) {
    return { current: 'Lunch', status: 'upcoming', nextTime: 'Starts at 1:00 PM' };
  } else if (currentMinutes >= 1080 && currentMinutes <= 1110) {
    return { current: 'High Tea', status: 'active', nextTime: 'Ends at 6:30 PM' };
  } else if (currentMinutes < 1080) {
    return { current: 'High Tea', status: 'upcoming', nextTime: 'Starts at 6:00 PM' };
  } else if (currentMinutes >= 1200 && currentMinutes <= 1260) {
    return { current: 'Dinner', status: 'active', nextTime: 'Ends at 9:00 PM' };
  } else {
    return { current: 'Breakfast', status: 'upcoming', nextTime: 'Tomorrow at 9:00 AM' };
  }
}
