import { useSelector } from 'react-redux';
import { selectUser } from '../../../features/auth/authSlice';
import { Check, Flame, MessageSquareDot } from 'lucide-react';
import { useState } from 'react';
import ChatWidget from '../../../components/ui/ChatWidget';

const UserDashView = () => {
  const user = useSelector(selectUser);

  const [checked, setChecked] = useState({});

  const tasks = [
    ['Morning Meditation', '07:00 • Wellness'],
    ['Deep Work Session', '09:03 • Work'],
    ['Team Sync', '13:00 • Work'],
    ['Review Goals', '17:00 • Personal'],
  ];
  const toggleCheck = (index) => {
    setChecked((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="bg-[#EEEEEE] p-4 font-sans sm:p-6 lg:p-8 dark:bg-zinc-900">
      {/* Welcome Header */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-[#8141EE] to-[#cdc0fe] px-4 py-16 text-white shadow-lg md:px-15.5 md:py-23 dark:from-[#6C3ADC] dark:to-[#4E2C9D]">
        <h1 className="mb-2 text-2xl font-semibold md:text-4xl">
          Good Morning {user?.fullName || user?.email?.split('@')[0] || 'User'} !
        </h1>
        {/* <p className="text-base text-purple-100 md:text-lg">
          You have 5 tasks scheduled for today. Let's make it a productive one.
        </p> */}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* AI Coach Chat Section */}
        <div className="rounded-xl bg-white p-6 shadow-md dark:bg-zinc-800">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100">AI Coach Chat</h2>
            <span className="text-base text-gray-400 dark:text-gray-200">2025-12-14</span>
          </div>

          <div className="space-y-5">
            {tasks.map(([title, meta], i) => (
              <div key={i} className="flex items-center gap-6 pb-4 md:gap-10">
                {/* real checkbox */}
                <input
                  type="checkbox"
                  checked={!!checked[i]}
                  onChange={() => toggleCheck(i)}
                  className="mt-1 h-4 w-4 accent-[#D9D9D9]"
                />

                <div>
                  <h3
                    className={`text-center text-base font-medium transition md:text-lg dark:text-gray-200 ${
                      checked[i] ? 'text-gray-400 line-through dark:text-gray-300' : 'text-gray-800'
                    }`}
                  >
                    {title}
                  </h3>
                  <p className={`text-xs ${checked[i] ? 'text-gray-400 ' : 'text-gray-300'}`}>
                    {meta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Quote & AI Coach */}
        <div className="md::space-y-6 space-y-2">
          {/* Daily Quote */}
          <div className="mb-4 flex flex-row items-center gap-6 rounded-xl bg-white px-6 py-6 shadow-md sm:py-8 md:gap-16 md:py-16 dark:bg-zinc-800">
            <div className="px-2 md:px-7.5 dark:text-gray-300">
              <MessageSquareDot size={28} />
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-800 md:text-2xl dark:text-gray-100">
                Daily Quote
              </h2>

              <p className="py-2 text-base text-gray-600 italic md:text-lg dark:text-gray-300">
                "The only way to do great work is to love what you do."
              </p>
            </div>
          </div>

          {/* AI Coach Chat List */}
          <div className="rounded-xl bg-white p-6 shadow-md dark:bg-zinc-800">
            <h2 className="text-xl font-medium text-gray-800 dark:text-gray-100">AI Coach Chat</h2>
            <div className="">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-lg p-3 transition"
                >
                  <span className="text-black dark:text-gray-200">Drink 2L Water</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                      08
                    </span>
                    <span className="text-sm text-yellow-500">{/* <Flame /> */}</span>
                    <span className="text-sm text-green-500">
                      <Check />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <ChatWidget />
    </div>
  );
};

export default UserDashView;
