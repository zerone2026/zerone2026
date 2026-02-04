'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Ticket,
  Calendar,
  Award,
  Users,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Crown,
  LogOut,
  Menu,
  X,
  Sparkles,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import QRCode from 'qrcode';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [qrCode, setQrCode] = useState('');
  const [qrCodeLoading, setQrCodeLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ticket');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [vipMap, setVipMap] = useState<Record<number, boolean>>({});


  const tabs = [
    { id: 'ticket', label: 'Your Ticket', icon: Ticket },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'your-events', label: 'Your Events', icon: Award },
  ];

  const [eventFormData, setEventFormData] = useState({
    teamMembers: [{ name: '', ticketNumber: '' }],
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/auth/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // Generate QR code immediately
    generateQRCode(parsedUser.ticketNumber);
  }, [router]);

  const generateQRCode = async (ticketNumber: string) => {
    setQrCodeLoading(true);
    try {
      const qrData = await QRCode.toDataURL(ticketNumber, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrCode(qrData);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setQrCodeLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleUpgradeVIP = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/upgrade-vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId, userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upgrade failed');
      }

      setShowVIPModal(false);
      setTransactionId('');
      alert('VIP upgrade request submitted! Wait for admin approval.');
      // Refresh user data
      const updatedUser = { ...user, ticketType: 'VIP' };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEventRegister = async () => {
    if (!selectedEvent) return;

    setLoading(true);
    try {
      const payload = {
        userId: user.id,
        eventId: selectedEvent.id,
        isTeamEvent: selectedEvent.isTeamEvent,
        transactionId: selectedEvent.registrationFee > 0 ? transactionId : null,
        teamMembers: selectedEvent.isTeamEvent ? eventFormData.teamMembers : [],
        finalFee: calculateFinalFee(selectedEvent),
      };

      const response = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      alert('Event registration submitted successfully!');
      setShowEventModal(false);
      setSelectedEvent(null);
      setEventFormData({ teamMembers: [{ name: '', ticketNumber: '' }] });
      setTransactionId('');
      // Reload your events
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  const checkTicketVIP = async (ticketNumber: string, index: number) => {
  if (!ticketNumber) return;

  try {
    const res = await fetch(
      `/api/tickets/check?ticketNumber=${encodeURIComponent(ticketNumber)}`
    );
    const data = await res.json();

    setVipMap((prev) => ({
      ...prev,
      [index]: data.valid && data.ticketType === 'VIP',
    }));
  } catch {
    setVipMap((prev) => ({ ...prev, [index]: false }));
  }
};


  const calculateFinalFee = (event: any) => {
  if (!event) return 0;

  const baseFee = event.registrationFee || 0;

  if (!event.isTeamEvent) {
    return user.ticketType === 'VIP'
      ? Math.max(baseFee - 10, 0)
      : baseFee;
  }

  const vipCount = Object.values(vipMap).filter(Boolean).length;
  return Math.max(baseFee - vipCount * 10, 0);
};


  const addTeamMember = () => {
    setEventFormData({
      ...eventFormData,
      teamMembers: [...eventFormData.teamMembers, { name: '', ticketNumber: '' }],
    });
  };

  const removeTeamMember = (index: number) => {
    const newMembers = eventFormData.teamMembers.filter((_, i) => i !== index);
    setEventFormData({ ...eventFormData, teamMembers: newMembers });
  };

  const updateTeamMember = (index: number, field: string, value: string) => {
    const newMembers = [...eventFormData.teamMembers];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setEventFormData({ ...eventFormData, teamMembers: newMembers });
  };
  if (!user) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-gray-400">Loading dashboard...</div>
    </div>
  );
}


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/50 backdrop-blur-lg border-b border-amber-500/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/zerone-logo.png"
                alt="Zerone 2026 Logo"
                className="w-10 h-10"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">ZERONE '26</h1>
                <p className="text-sm text-gray-400">{user.name}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden mt-4 pt-4 border-t border-amber-500/20"
              >
                <nav className="flex flex-col gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-left ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-left text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'ticket' && (
            <motion.div
              key="ticket"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* QR Code Ticket */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`bg-white/5 backdrop-blur-lg border-2 rounded-3xl p-8 text-center ${
                    user.ticketType === 'VIP'
                      ? 'border-amber-400 shadow-lg shadow-amber-500/20'
                      : 'border-white/20'
                  }`}
                >
                  {user.ticketType === 'VIP' && (
                    <div className="flex items-center justify-center gap-2 text-amber-400 mb-4">
                      <Crown className="w-6 h-6" />
                      <span className="font-bold text-xl">VIP Ticket</span>
                    </div>
                  )}

                  <div className="bg-white rounded-2xl p-6 mb-6 inline-block">
                    {qrCodeLoading ? (
                      <div className="w-48 h-48 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : qrCode ? (
                      <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center">
                        <p className="text-red-400">Failed to load QR Code</p>
                      </div>
                    )}
                  </div>

                  <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
                  <p className={`text-xl font-mono mb-6 ${
                    user.ticketType === 'VIP' ? 'text-amber-400' : 'text-white'
                  }`}>
                    {user.ticketNumber}
                  </p>

                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Calendar className="w-5 h-5" />
                    <span>Feb 4 & 5, 2026</span>
                  </div>
                </motion.div>

                {/* Ticket Info & Upgrade */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-6"
                  >
                    <h3 className="text-2xl font-bold text-white mb-4">Your Ticket</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Type</span>
                        <span className={`font-bold ${user.ticketType === 'VIP' ? 'text-amber-400' : 'text-white'}`}>
                          {user.ticketType === 'VIP' ? 'VIP' : 'Regular'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Institution</span>
                        <span className="text-white">{user.institution}</span>
                      </div>
                    </div>
                  </motion.div>

                  {user.ticketType === 'REGULAR' && (
                    <motion.button
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      onClick={() => setShowVIPModal(true)}
                      whileHover={{ scale: 1.02 }}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold py-4 rounded-2xl text-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50"
                    >
                      <Crown className="w-6 h-6" />
                      Upgrade to VIP Ticket
                      <ArrowRight className="w-6 h-6" />
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-8">All Events</h2>
                <EventsList onSelectEvent={(event) => {
                  setSelectedEvent(event);
                  setShowEventModal(true);
                  setTransactionId('');
                  if (!event.isTeamEvent) {
                    setEventFormData({ teamMembers: [{ name: '', ticketNumber: '' }] });
                  } else {
                    setEventFormData({ teamMembers: Array(event.teamSize).fill(null).map(() => ({ name: '', ticketNumber: '' })) });
                  }
                }} />
              </div>
            </motion.div>
          )}

          {activeTab === 'your-events' && (
            <motion.div
              key="your-events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-8">Your Registered Events</h2>
                <YourEventsList userId={user.id} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sponsors Section */}
      <section className="bg-black/30 border-t border-amber-500/20 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Our Sponsors</h2>
          <SponsorsList />
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="bg-black/30 border-t border-amber-500/20 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Contact Us</h2>
          <ContactSection />
        </div>
      </section>

      {/* VIP Upgrade Modal */}
      <AnimatePresence>
        {showVIPModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowVIPModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/30 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Upgrade to VIP</h2>
                <button
                  onClick={() => setShowVIPModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Regular Ticket */}
                <div className="bg-white/5 border border-white/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-gray-400 mb-4">Regular Ticket</h3>
                  <ul className="space-y-3 text-gray-400">
                    <li className="flex items-center gap-2">
                      <X className="w-5 h-5 text-red-400" />
                      Food excluded
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="w-5 h-5 text-red-400" />
                      No discount on events
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="w-5 h-5 text-red-400" />
                      Accommodation excluded
                    </li>
                    <li className="flex items-center gap-2">
                      <X className="w-5 h-5 text-red-400" />
                      No access to cultural night
                    </li>
                  </ul>
                </div>

                {/* VIP Ticket */}
                <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 text-amber-400 mb-4">
                    <Crown className="w-6 h-6" />
                    <h3 className="text-xl font-bold">VIP Ticket</h3>
                  </div>
                  <ul className="space-y-3 text-white">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <div>
                        <span className="font-semibold">Food included:</span>
                        <p className="text-sm text-gray-400">Day 01: Dinner | Day 02: Breakfast, Lunch</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <div>
                        <span className="font-semibold">Discount on events:</span>
                        <p className="text-sm text-gray-400">₹10 off on registration fee</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <div>
                        <span className="font-semibold">Accommodation included</span>
                        <p className="text-sm text-gray-400">(not for MES PNI students)</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      Access to cultural night
                    </li>
                  </ul>
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white/5 border border-amber-500/20 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-2 text-amber-400 mb-4">
                  <DollarSign className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Payment Details</h3>
                </div>
                <p className="text-white mb-4">
                  Transfer <span className="text-amber-400 font-bold text-xl">₹350</span> to{' '}
                  <span className="font-mono"> 88484 75192</span> via GPay
                </p>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Transaction ID *
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full bg-white/5 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                    placeholder="Enter your GPay transaction ID"
                  />
                </div>
              </div>

              <button
                onClick={handleUpgradeVIP}
                disabled={loading || !transactionId}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold py-4 rounded-xl text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/50"
              >
                {loading ? 'Processing...' : 'Buy VIP Ticket'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Registration Modal */}
      <AnimatePresence>
        {showEventModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/30 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Register for {selectedEvent.name}</h2>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setSelectedEvent(null);
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                {/* Event Details */}
                <div className="bg-white/5 border border-amber-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedEvent.isTeamEvent
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {selectedEvent.isTeamEvent ? 'Team Event' : 'Solo Event'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Time</p>
                      <p className="text-white font-medium">{selectedEvent.time}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Venue</p>
                      <p className="text-white font-medium">{selectedEvent.venue}</p>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-amber-500/20">
                    <p className="text-gray-400 text-sm">Reward</p>
                    <p className="text-white">{selectedEvent.rewardPool}</p>
                  </div>
                </div>
{/* Team Members for team events */}
{selectedEvent.isTeamEvent && (
  <div className="space-y-4">

    {/* Header + Add button */}
    <div className="bg-white/5 border border-amber-500/20 rounded-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-white">Team Members</h3>
        <span className="text-sm text-gray-400">
          ({eventFormData.teamMembers.filter(m => m.name).length}/{selectedEvent.teamSize})
        </span>
      </div>

      <button
        type="button"
        onClick={addTeamMember}
        disabled={eventFormData.teamMembers.length >= selectedEvent.teamSize}
        className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50"
      >
        + Add Member
      </button>
    </div>

    {/* Members list */}
    <div className="space-y-3 max-h-48 overflow-y-auto">
      {eventFormData.teamMembers.map((member, index) => (
        <div key={index} className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Member {index + 1} Name
            </label>
            <input
              type="text"
              value={member.name}
              onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
              className="w-full bg-white/10 border border-amber-500/30 rounded-lg px-3 py-2 text-white text-sm"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">
              Member {index + 1} Ticket Number
            </label>
            <input
  type="text"
  value={member.ticketNumber}
  onChange={(e) => {
    const value = e.target.value;
    updateTeamMember(index, 'ticketNumber', value);
    checkTicketVIP(value, index);
  }}
  className="w-full bg-white/10 border border-amber-500/30 rounded-lg px-3 py-2 text-white text-sm"
  placeholder="Enter ticket number"
/>

          </div>

          {eventFormData.teamMembers.length > 1 && (
            <button
              type="button"
              onClick={() => removeTeamMember(index)}
              className="text-red-400 hover:text-red-300 self-start mt-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>

  </div>
)}
                {/* Fee */}
                <div className="bg-white/5 border border-amber-500/20 rounded-xl p-4">
  <div className="flex justify-between items-center">
    <div>
      <p className="text-gray-400">Registration Fee</p>
      <p className="text-white text-xl font-bold">
        {calculateFinalFee(selectedEvent) > 0
          ? `₹${calculateFinalFee(selectedEvent)}`
          : 'Free'}
      </p>
    </div>

    <span
      className={`text-xl font-bold ${
        selectedEvent.registrationFee === 0
          ? 'text-green-400'
          : 'text-amber-400'
      }`}
    >
      {selectedEvent.registrationFee === 0 ? 'FREE' : 'PAID'}
    </span>
  </div>
</div>


                {/* Transaction ID for paid solo events */}
                {selectedEvent.registrationFee > 0 && !selectedEvent.isTeamEvent && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                    <div className="text-center">
                      <p className="text-amber-400 text-sm mb-3 font-semibold">Payment Instructions</p>
                      <p className="text-white text-lg mb-4">Transfer amount to <span className="font-mono font-bold"> +91 88484 75192</span> via GPay and upload transaction ID below</p>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Transaction ID *
                        </label>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full bg-white/5 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                          placeholder="Enter your GPay transaction ID"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Transaction ID for paid team events */}
                {selectedEvent.registrationFee > 0 && selectedEvent.isTeamEvent && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                    <div className="text-center">
                      <p className="text-amber-400 text-sm mb-3 font-semibold">Payment Instructions</p>
                      <p className="text-white text-lg mb-4">Transfer amount to <span className="font-mono font-bold"> +91 88484 75192</span> via GPay and upload transaction ID below</p>
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Transaction ID *
                        </label>
                        <input
                          type="text"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full bg-white/5 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all"
                          placeholder="Enter your GPay transaction ID"
                        />
                      </div>
                    </div>
                  </div>
                )}



                <button
                  onClick={handleEventRegister}
                  disabled={
                    loading ||
                    (selectedEvent.registrationFee > 0 && !transactionId) ||
                    (selectedEvent.isTeamEvent && eventFormData.teamMembers.filter(m => m.name).length < selectedEvent.teamSize)
                  }
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold py-4 rounded-xl text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/50"
                >
                  {loading ? 'Registering...' : selectedEvent.registrationFee === 0 ? 'Register Now (Free)' : 'Register Now'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-black/50 backdrop-blur-lg border-t border-amber-500/20 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Developed by Murshida P - murshidaprml@gmail.com | MES Ponnani College
          </p>
        </div>
      </footer>
    </div>
  );
}

// Placeholder components
function EventsList({ onSelectEvent }: { onSelectEvent: (event: any) => void }) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then((res) => res.json())
      .then((data) => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching events:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No events available yet</p>
        <p className="text-gray-500 mt-2">Check back later for exciting competitions!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 cursor-pointer"
          onClick={() => onSelectEvent(event)}
        >
          <div className="flex items-center justify-between mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              event.isTeamEvent
                ? 'bg-blue-500/20 text-blue-400'
                : 'bg-green-500/20 text-green-400'
            }`}>
              {event.isTeamEvent ? 'Team Event' : 'Solo Event'}
            </span>
            {event.registrationFee > 0 && (
              <span className="text-amber-400 font-bold">
                ₹{event.registrationFee}
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>

          {event.isTeamEvent && (
            <p className="text-gray-400 text-sm mb-2">
              Team Size: {event.teamSize} members
            </p>
          )}

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-gray-300">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="text-sm">{event.rewardPool}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="text-sm">{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="text-sm">{event.venue}</span>
            </div>
          </div>

          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

          <div className="border-t border-amber-500/20 pt-4 mb-4">
            <p className="text-xs text-gray-500 mb-1">Coordinators:</p>
            <p className="text-sm text-gray-300">
              {event.coordinator1Name} - {event.coordinator1Phone}
            </p>
            {event.coordinator2Name && (
              <p className="text-sm text-gray-300">
                {event.coordinator2Name} - {event.coordinator2Phone}
              </p>
            )}
          </div>

          <button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold py-3 rounded-xl text-lg flex items-center justify-center gap-2 transition-all duration-300">
            Register Now
            <span className="text-xs font-normal">
              {event.registrationFee > 0 ? `(₹${event.registrationFee})` : '(Free)'}
            </span>
          </button>
        </motion.div>
      ))}
    </div>
  );
}

function YourEventsList({ userId }: { userId: string }) {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/events/user-events?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setRegistrations(data.registrations || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user events:', err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading your events...</p>
      </div>
    );
  }

  if (registrations.length === 0) {
    return (
      <div className="text-center py-20">
        <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No events registered yet</p>
        <p className="text-gray-500 mt-2">Browse events and register for exciting competitions!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {registrations.map((registration, index) => (
        <motion.div
          key={registration.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            <span className="text-green-400 font-bold">Registered</span>
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">{registration.event.name}</h3>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="w-5 h-5 text-amber-400" />
              <span>{registration.event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="w-5 h-5 text-amber-400" />
              <span>{registration.event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Phone className="w-5 h-5 text-amber-400" />
              <span>{registration.event.coordinator1Name}</span>
            </div>
          </div>

          <div className="border-t border-amber-500/20 pt-4 mt-4">
            <p className="text-sm text-gray-400 mb-2">
              Coordinator: {registration.event.coordinator1Phone}
            </p>
            {registration.teamMembers && registration.teamMembers.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-400 mb-1">Team Members:</p>
                {registration.teamMembers.map((member, idx) => (
                  <p key={idx} className="text-sm text-gray-300">
                    {member.memberName} ({member.memberTicketNumber})
                  </p>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SponsorsList() {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/sponsors')
      .then((res) => res.json())
      .then((data) => {
        setSponsors(data.sponsors || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching sponsors:', err);
        setLoading(false);
      });
  }, []);

  // Group sponsors by type
  const titleSponsors = sponsors.filter(s => s.type === 'TITLE');
  const coSponsors = sponsors.filter(s => s.type === 'CO_SPONSOR');
  const eventSponsors = sponsors.filter(s => s.type === 'EVENT_SPONSOR');

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading sponsors...</p>
      </div>
    );
  }

  if (sponsors.length === 0) {
    return (
      <div className="text-center py-20">
        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No sponsors yet</p>
        <p className="text-gray-500 mt-2">Check back later for sponsor information!</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Title Sponsors */}
      {titleSponsors.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-amber-400 mb-6 text-center">Title Sponsors</h3>
          <div className="grid grid-cols-1 gap-6">
            {titleSponsors.map((sponsor) => (
              <div key={sponsor.id} className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-300">
                {sponsor.logoUrl && (
                  <img
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    className="w-40 h-40 mx-auto mb-4 rounded-lg object-contain"
                  />
                )}
                <h4 className="text-xl font-bold text-white mb-2">{sponsor.name}</h4>
                {sponsor.websiteUrl && (
                  <a
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold rounded-lg transition-all duration-300"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Co-Sponsors */}
      {coSponsors.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-amber-400 mb-6 text-center">Co-Sponsors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coSponsors.map((sponsor) => (
              <div key={sponsor.id} className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300">
                {sponsor.logoUrl && (
                  <img
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    className="w-32 h-32 mx-auto mb-4 rounded-lg object-contain"
                  />
                )}
                <h4 className="text-lg font-bold text-white mb-2">{sponsor.name}</h4>
                {sponsor.websiteUrl && (
                  <a
                    href={sponsor.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold rounded-lg transition-all duration-300"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Sponsors */}
      {eventSponsors.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold text-amber-400 mb-6 text-center">Event Sponsors</h3>
          <div className="space-y-4">
            {eventSponsors.map((sponsor, index) => (
              <div key={sponsor.id} className={`bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-6 ${index < eventSponsors.length - 1 ? 'mb-6' : ''}`}>
                <div className="mb-4">
                  <p className="text-amber-400 text-sm font-medium">Sponsoring: {sponsor.eventName}</p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-6 text-center">
                  {sponsor.logoUrl && (
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="w-24 h-24 mx-auto rounded-lg object-contain"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-white mb-2">{sponsor.name}</h4>
                    {sponsor.websiteUrl && (
                      <a
                        href={sponsor.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold rounded-lg transition-all duration-300"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ContactSection() {
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/contact')
      .then((res) => res.json())
      .then((data) => {
        setContactInfo(data.contactInfo);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching contact info:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading contact information...</p>
      </div>
    );
  }

  if (!contactInfo) {
    return (
      <div className="text-center py-20">
        <Phone className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Contact information coming soon</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Student Coordinators */}
      <div className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
          <Mail className="w-6 h-6" />
          Student Coordinators
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-white font-medium">{contactInfo.studentCoordinatorName}</p>
              <p className="text-gray-400 text-sm">{contactInfo.studentCoordinatorPhone}</p>
              <p className="text-gray-400 text-sm">{contactInfo.studentCoordinatorEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Coordinators */}
      <div className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
          <Award className="w-6 h-6" />
          Faculty Coordinators
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-white font-medium">{contactInfo.facultyCoordinatorName}</p>
              <p className="text-gray-400 text-sm">{contactInfo.facultyCoordinatorPhone}</p>
              <p className="text-gray-400 text-sm">{contactInfo.facultyCoordinatorEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fest Information */}
      <div className="md:col-span-2 bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
          <Sparkles className="w-6 h-6" />
          Fest Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400 text-sm">Fest Email</p>
              <p className="text-white font-medium">{contactInfo.festEmail}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400 text-sm">College Email</p>
              <p className="text-white font-medium">{contactInfo.collegeEmail}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-1" />
            <div>
              <p className="text-gray-400 text-sm">College Address</p>
              <p className="text-white font-medium">{contactInfo.collegeAddress}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
