'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  LogOut,
  Menu,
  X,
  Calendar,
  Shield,
  CheckCircle2,
  Camera,
  FileText,
  Award,
  Phone,
  Mail,
  MapPin,
  Crown,
} from 'lucide-react';

export default function OrganizerDashboard() {
  const router = useRouter();
  const [festRegistrations, setFestRegistrations] = useState<any[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [activeSection, setActiveSection] = useState<'attendance' | 'event-details' | 'registrations'>('attendance');
  const [attendanceType, setAttendanceType] = useState<'fest' | 'event'>('fest');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [registrationType, setRegistrationType] = useState<'fest' | 'event'>('fest');
  const [selectedEventForRegistrations, setSelectedEventForRegistrations] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [ticketInput, setTicketInput] = useState('');

  useEffect(() => {
    const organizerData = localStorage.getItem('organizer');
    if (!organizerData) {
      router.push('/auth/login');
      return;
    }

    loadFestRegistrations();
    loadEvents();
  }, [router]);

  const loadFestRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/registrations?type=fest');
      const data = await res.json();
      setFestRegistrations(data.registrations || []);
    } catch (err) {
      console.error('Error loading registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error('Error loading events:', err);
    }
  };

  const loadEventRegistrations = async (eventId: string) => {
    setLoading(true);
    try {
      const url = '/api/admin/registrations?type=events&eventId=' + eventId;
      const res = await fetch(url);
      const data = await res.json();
      setEventRegistrations(data.registrations || []);
    } catch (err) {
      console.error('Error loading event registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('organizer');
    router.push('/');
  };

const handleScanQRCode = async (ticketCode: string) => {
  if (!ticketCode) return;

  try {
    const res = await fetch('/api/organizer/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticketCode,
        type: attendanceType,
        eventId: attendanceType === 'event' ? selectedEvent?.id : null,
      }),
    });

    const data = await res.json();

    alert(data.message || data.error || 'Scan completed');
  } catch (err) {
    alert('Scan failed');
    console.error(err);
  }
};


  const simulateQRScan = (ticketNumber: string) => {
    handleScanQRCode(ticketNumber);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
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
                <h1 className="text-xl md:text-2xl font-bold text-white">ZERONE 2026</h1>
                <p className="text-sm text-gray-400">Organizer Panel</p>
              </div>
            </div>

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

          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden mt-4 pt-4 border-t border-amber-500/20"
              >
                <nav className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setActiveSection('attendance');
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-left bg-gradient-to-r from-amber-500 to-yellow-500 text-black"
                  >
                    <Shield className="w-5 h-5" />
                    Mark Attendance
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection('event-details');
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-left bg-gradient-to-r from-amber-500 to-yellow-500 text-black"
                  >
                    <FileText className="w-5 h-5" />
                    Event Details
                  </button>
                  <button
                    onClick={() => {
                      setActiveSection('registrations');
                      setMobileMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-left bg-gradient-to-r from-amber-500 to-yellow-500 text-black"
                  >
                    <Users className="w-5 h-5" />
                    Registrations
                  </button>
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

      <main className="flex-grow container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeSection === 'attendance' && (
            <motion.div
              key="attendance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6">Mark Attendance</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => {
                      setAttendanceType('fest');
                      setSelectedEvent(null);
                    }}
                    className={'py-6 rounded-xl transition-all ' + (
                      attendanceType === 'fest'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    )}
                  >
                    <Calendar className="w-8 h-8 mb-2 mx-auto" />
                    <p className="text-xl font-bold">Zerone 2026</p>
                    <p className="text-sm text-gray-400">Scan QR code to mark fest attendance</p>
                  </button>

                  <button
                    onClick={() => {
                      setAttendanceType('event');
                    }}
                    className={'py-6 rounded-xl transition-all ' + (
                      attendanceType === 'event'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    )}
                  >
                    <Award className="w-8 h-8 mb-2 mx-auto" />
                    <p className="text-xl font-bold">Events</p>
                    <p className="text-sm text-gray-400">Select event and scan QR codes</p>
                  </button>
                </div>

                {attendanceType === 'event' && (
                  <div className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">Select Event</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {events.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => setSelectedEvent(event)}
                          className={'p-4 rounded-lg transition-all ' + (
                            selectedEvent?.id === event.id
                              ? 'bg-amber-500 text-black'
                              : 'bg-white/10 hover:bg-white/20 text-white'
                          )}
                        >
                          <p className="font-bold">{event.name}</p>
                          <p className="text-xs text-gray-400 mt-1">{event.venue}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {(attendanceType === 'fest' || (attendanceType === 'event' && selectedEvent)) && (
                  <div className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-xl p-6">
                    <div className="text-center mb-6">
                      <Camera className="w-16 h-16 text-amber-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white">
                        {attendanceType === 'fest' ? 'Scan Fest Attendance QR Code' : 'Scan ' + (selectedEvent?.name || '') + ' Attendance QR Code'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {attendanceType === 'fest'
                          ? 'Scan user\'s ticket QR code to mark their fest attendance'
                          : 'Scan user\'s ticket QR code to mark their event attendance'
                        }
                      </p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-4 mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Enter Ticket Number (Manual Entry)
                      </label>
                      <div className="flex gap-2 mt-4">
                        <input
  type="text"
  value={ticketInput}
  onChange={(e) => setTicketInput(e.target.value)}
  className="flex-1 bg-white/5 border border-amber-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
  placeholder="Ticket number"
/>

                        <button
  onClick={() => {
    handleScanQRCode(ticketInput);
    setTicketInput('');
  }}
  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold px-6 py-3 rounded-lg transition-all"
>
  Mark Attendance
</button>

                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                      <p className="text-amber-400 text-sm">
                        <strong>Note:</strong> If user hasn't registered for event, you will see a "Not found" message when QR is scanned.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'event-details' && (
            <motion.div
              key="event-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6">Event Details</h2>

                {loading ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading events...</p>
                  </div>
                ) : events.length === 0 ? (
                  <p className="text-gray-400 text-center py-20">No events available</p>
                ) : selectedEventForDetails ? (
                  <div className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-8 mb-6">
                    <button
                      onClick={() => setSelectedEventForDetails(null)}
                      className="text-gray-400 hover:text-white mb-4"
                    >
                      ← Back to Events
                    </button>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-amber-400 mb-2">{selectedEventForDetails.name}</h3>
                        <span className={'ml-2 px-3 py-1 rounded-full text-xs font-medium ' + (
                          selectedEventForDetails.isTeamEvent
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-green-500/20 text-green-400'
                        )}>
                          {selectedEventForDetails.isTeamEvent ? 'Team Event' : 'Solo Event'}
                        </span>
                      </div>

                      {selectedEventForDetails.isTeamEvent && (
                        <p className="text-gray-300">Team Size: {selectedEventForDetails.teamSize} members</p>
                      )}

                      <div>
                        <p className="text-gray-400 mb-1">Reward Pool</p>
                        <p className="text-white text-lg">{selectedEventForDetails.rewardPool}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 mb-1">Time</p>
                          <p className="text-white">{selectedEventForDetails.time}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Venue</p>
                          <p className="text-white">{selectedEventForDetails.venue}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-400 mb-1">Registration Fee</p>
                        <p className="text-white text-xl font-bold">
                          {selectedEventForDetails.registrationFee > 0 ? '₹' + selectedEventForDetails.registrationFee : 'Free'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-amber-500/20">
                      <h4 className="text-lg font-bold text-amber-400 mb-4">Coordinators</h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 mb-1">Coordinator 1</p>
                          <p className="text-white font-medium">{selectedEventForDetails.coordinator1Name}</p>
                          <p className="text-gray-300">{selectedEventForDetails.coordinator1Phone}</p>
                        </div>

                        {selectedEventForDetails.coordinator2Name && (
                          <div>
                            <p className="text-gray-400 mb-1">Coordinator 2</p>
                            <p className="text-white font-medium">{selectedEventForDetails.coordinator2Name}</p>
                            <p className="text-gray-300">{selectedEventForDetails.coordinator2Phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => setSelectedEventForDetails(event)}
                        className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-xl p-6 hover:bg-white/10 transition-all text-left"
                      >
                        <div className="mb-3">
                          <span className={'px-3 py-1 rounded-full text-xs font-medium ' + (
                            event.isTeamEvent
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-green-500/20 text-green-400'
                          )}>
                            {event.isTeamEvent ? 'Team' : 'Solo'}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{event.name}</h3>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div className="flex items-center gap-2">
                            <Award className="w-4 h-4 text-amber-400" />
                            <span>{event.rewardPool}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-amber-400" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-amber-400" />
                            <span>{event.venue}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'registrations' && (
            <motion.div
              key="registrations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-white mb-6">Registrations</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => {
                      setRegistrationType('fest');
                      setSelectedEventForRegistrations(null);
                    }}
                    className={'py-4 rounded-xl transition-all ' + (
                      registrationType === 'fest'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    )}
                  >
                    <Calendar className="w-6 h-6 mb-2" />
                    <div className="text-left">
                      <p className="text-lg font-bold">Zerone 2026 Registrations</p>
                      <p className="text-sm text-gray-400">Golden tickets and validated VIP tickets</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setRegistrationType('event');
                      setSelectedEventForRegistrations(null);
                    }}
                    className={'py-4 rounded-xl transition-all ' + (
                      registrationType === 'event'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    )}
                  >
                    <Award className="w-6 h-6 mb-2" />
                    <div className="text-left">
                      <p className="text-lg font-bold">Event Registrations</p>
                      <p className="text-sm text-gray-400">Free registrations and validated paid registrations</p>
                    </div>
                  </button>
                </div>

                {registrationType === 'event' && !selectedEventForRegistrations && (
                  <div className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">Select Event</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {events.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => loadEventRegistrations(event.id)}
                          className="p-4 rounded-lg transition-all bg-white/10 hover:bg-white/20 text-white"
                        >
                          <p className="font-bold">{event.name}</p>
                          <p className="text-xs text-gray-400 mt-1">Click to view registrations</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {registrationType === 'fest' && (
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        setRegistrationType('fest');
                        loadFestRegistrations();
                      }}
                      className="bg-amber-500 text-black px-4 py-2 rounded-lg font-medium mb-4"
                    >
                      Website Users
                    </button>

                    {loading ? (
                      <div className="text-center py-20">
                        <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-400">Loading registrations...</p>
                      </div>
                    ) : festRegistrations.length === 0 ? (
                      <p className="text-gray-400 text-center py-20">No registrations yet</p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {festRegistrations.map((registration, index) => (
                          <div key={registration.id} className="bg-white/5 backdrop-blur-lg border border-amber-500/30 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <span className="text-amber-400 font-bold text-lg">#{index + 1}</span>
                                <p className="text-white font-bold text-xl">{registration.name}</p>
                                <p className="text-gray-400 text-sm">{registration.institution}</p>
                              </div>
                              {registration.ticketType === 'VIP' && (
                                <Crown className="w-6 h-6 text-amber-400" />
                              )}
                            </div>
                            <div className="border-t border-amber-500/20 pt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-amber-400" />
                                <p className="text-white">{registration.phone}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-amber-400" />
                                <p className="text-white">{registration.email}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {registrationType === 'event' &&
  selectedEventForRegistrations &&
  eventRegistrations.length > 0 && (
    <div>
      <button
        onClick={() => setSelectedEventForRegistrations(null)}
        className="text-amber-400 hover:text-amber-300 mb-4"
      >
        ← Back to Events
      </button>

      <div className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-6 mb-4">
        <h3 className="text-2xl font-bold text-amber-400 mb-6">
          {eventRegistrations[0].event.name}
        </h3>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading registrations...</p>
          </div>
        ) : eventRegistrations.length === 0 ? (
          <p className="text-gray-400 text-center py-20">
            No registrations for this event yet
          </p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {eventRegistrations.map((registration, index) => (
              <div
                key={registration.id}
                className="bg-white/5 backdrop-blur-lg border border-amber-500/30 rounded-xl p-4"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <span className="text-amber-400 font-bold text-lg">
                      #{index + 1}
                    </span>
                    <p className="text-white font-bold text-xl">
                      {registration.name}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {registration.institution}
                    </p>
                  </div>

                  <div
                    className={
                      'px-3 py-1 rounded-full text-xs font-medium ' +
                      (registration.finalFee > 0
                        ? 'bg-amber-400 text-black'
                        : 'bg-green-400 text-black')
                    }
                  >
                    {registration.finalFee > 0 ? 'PAID' : 'FREE'}
                  </div>
                </div>

                <div className="border-t border-amber-500/20 pt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-amber-400" />
                    <p className="text-white">{registration.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <p className="text-white">{registration.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

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
