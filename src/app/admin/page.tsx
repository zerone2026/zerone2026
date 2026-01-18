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
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Crown,
  Shield,
  FileText,
  Download,
  Filter,
  LogOut,
  Menu,
  ChevronRight,
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('validate');
  const [pendingVIPs, setPendingVIPs] = useState<any[]>([]);
  const [pendingEvents, setPendingEvents] = useState<any[]>([]);
  const [festRegistrations, setFestRegistrations] = useState<any[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [contactInfo, setContactInfo] = useState<any>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [editingSponsor, setEditingSponsor] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [registrationType, setRegistrationType] = useState<'fest' | 'event'>('fest');
  const [attendeesType, setAttendeesType] = useState<'zerone' | 'event'>('zerone');
  const [festAttendees, setFestAttendees] = useState<any[]>([]);
  const [eventAttendees, setEventAttendees] = useState<any[]>([]);
  const [selectedAttendeeEventId, setSelectedAttendeeEventId] = useState<string | null>(null);

  const sections = [
    { id: 'validate', label: 'Validate Tickets', icon: Shield },
    { id: 'manage-events', label: 'Manage Events', icon: Calendar },
    { id: 'registrations', label: 'Registrations', icon: Users },
    { id: 'attendees', label: 'Attendees', icon: CheckCircle2 },
    { id: 'sponsors', label: 'Sponsors', icon: Award },
    { id: 'contact', label: 'Contact Us', icon: Phone },
  ];

  useEffect(() => {
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      router.push('/auth/login');
      return;
    }

    // Load initial data
    loadData();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load pending validations
      const vipRes = await fetch('/api/admin/validate?type=vip');
      const vipData = await vipRes.json();
      setPendingVIPs(vipData.validations || []);

      const eventsRes = await fetch('/api/admin/validate?type=events');
      const eventsData = await eventsRes.json();
      setPendingEvents(eventsData.validations || []);

      // Load sponsors
      const sponsorsRes = await fetch('/api/admin/sponsors');
      const sponsorsData = await sponsorsRes.json();
      setSponsors(sponsorsData.sponsors || []);

      // Load contact info
      const contactRes = await fetch('/api/admin/contact');
      const contactData = await contactRes.json();
      setContactInfo(contactData.contactInfo);

      // Load events
      const eventsListRes = await fetch('/api/events');
      const eventsListData = await eventsListRes.json();
      setEvents(eventsListData.events || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadFestRegistrations = async () => {
    try {
      const res = await fetch('/api/admin/registrations?type=fest');
      const data = await res.json();
      setFestRegistrations(data.registrations || []);
    } catch (err) {
      console.error('Error loading registrations:', err);
    }
  };

  const loadEventRegistrations = async (eventId: string) => {
    try {
      const res = await fetch(`/api/admin/registrations?type=events&eventId=${eventId}`);
      const data = await res.json();
      setEventRegistrations(data.registrations || []);
    } catch (err) {
      console.error('Error loading event registrations:', err);
    }
  };

  const handleValidate = async (type: string, id: string, status: 'APPROVED' | 'REJECTED') => {   
     try {
      const res = await fetch('/api/admin/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, status }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        // Reload data
        if (type === 'vip') {
          const vipRes = await fetch('/api/admin/validate?type=vip');
          const vipData = await vipRes.json();
          setPendingVIPs(vipData.validations || []);
        } else if (type === 'events') {
          const eventsRes = await fetch('/api/admin/validate?type=events');
          const eventsData = await eventsRes.json();
          setPendingEvents(eventsData.validations || []);
        }
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Validation failed');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.push('/');
  };

  const handleAddEvent = async (formData: any) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Event created successfully');
        setShowEventModal(false);
        loadData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to create event');
      console.error(err);
    }
  };

  const handleUpdateEvent = async (formData: any) => {
    if (!editingEvent) return;

    try {
      const res = await fetch(`/api/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Event updated successfully');
        setShowEventModal(false);
        setEditingEvent(null);
        loadData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to update event');
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        alert('Event deleted successfully');
        loadData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to delete event');
      console.error(err);
    }
  };

  const handleAddSponsor = async (formData: any) => {
    try {
      const res = await fetch('/api/admin/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Sponsor added successfully');
        setShowSponsorModal(false);
        loadData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to add sponsor');
      console.error(err);
    }
  };

  const handleUpdateSponsor = async (formData: any) => {
    if (!editingSponsor) return;

    try {
      const res = await fetch('/api/admin/sponsors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Sponsor updated successfully');
        setShowSponsorModal(false);
        setEditingSponsor(null);
        loadData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to update sponsor');
      console.error(err);
    }
  };

  const handleDeleteSponsor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return;

    try {
      const res = await fetch('/api/admin/sponsors', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Sponsor deleted successfully');
        loadData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to delete sponsor');
      console.error(err);
    }
  };

  const handleUpdateContact = async (formData: any) => {
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Contact info updated successfully');
        setShowContactModal(false);
        loadData();
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Failed to update contact info');
      console.error(err);
    }
  };

  const exportRegistrations = async () => {
  try {
    const body: any = { type: registrationType };

    // ✅ IMPORTANT: send eventId for event registrations
    if (registrationType === 'event' && selectedEventId) {
      body.eventId = selectedEventId;
    }

    const res = await fetch('/api/admin/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Export failed');
      return;
    }

    const blob = new Blob([data.csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = data.filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Export error:', err);
    alert('Export failed');
  }
};


  const loadFestAttendees = async () => {
    try {
      const res = await fetch('/api/admin/attendees?type=zerone');
      const data = await res.json();
      setFestAttendees(data.attendees || []);
    } catch (err) {
      console.error('Error loading fest attendees:', err);
    }
  };

  const loadEventAttendees = async (eventId: string) => {
    try {
      const res = await fetch(`/api/admin/attendees?type=event&eventId=${eventId}`);
      const data = await res.json();
      setEventAttendees(data.attendees || []);
    } catch (err) {
      console.error('Error loading event attendees:', err);
    }
  };

  const exportAttendees = async () => {
    try {
      const body: any = { type: attendeesType };
      if (attendeesType === 'event' && selectedAttendeeEventId) {
        body.eventId = selectedAttendeeEventId;
      }

      const res = await fetch('/api/admin/export', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const data = await res.json(); // ✅ move this here

if (res.ok) {
  const blob = new Blob([data.csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = data.filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
} else {
  alert(data.error || 'Failed to export');
}

    } catch (err) {
      alert('Export failed');
      console.error(err);
    }
  };

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
                <h1 className="text-xl md:text-2xl font-bold text-white">ZERONE 2026</h1>
                <p className="text-sm text-gray-400">Admin Panel</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  {section.label}
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
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-left ${
                        activeSection === section.id
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <section.icon className="w-5 h-5" />
                      {section.label}
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
          {activeSection === 'validate' && (
            <motion.div
              key="validate"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* VIP Validations */}
                <div className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Crown className="w-6 h-6 text-amber-400" />
                    Zerone 2026 Validations
                  </h2>
                  {pendingVIPs.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No pending VIP validations</p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {pendingVIPs.map((vip) => (
                        <div key={vip.id} className="bg-white/5 rounded-xl p-4 border border-amber-500/30">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-white font-bold">{vip.user.name}</p>
                              <p className="text-gray-400 text-sm">{vip.user.email}</p>
                              <p className="text-gray-400 text-sm">{vip.user.institution}</p>
                            </div>
                            <div className="flex gap-2">
  <button
    onClick={() => handleValidate('vip', vip.id, 'APPROVED')}
    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
  >
    Validate
  </button>

  <button
    onClick={() => handleValidate('vip', vip.id, 'REJECTED')}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
  >
    Reject
  </button>
</div>

                          </div>
                          <div className="mt-2 pt-2 border-t border-amber-500/20">
                            <p className="text-sm text-gray-400">Transaction ID: {vip.transactionId}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Event Validations */}
                <div className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-amber-400" />
                    Event Registrations
                  </h2>
                  {pendingEvents.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No pending event registrations</p>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {pendingEvents.map((reg) => (
                        <div key={reg.id} className="bg-white/5 rounded-xl p-4 border border-amber-500/30">
                          <div className="mb-2">
                            <p className="text-white font-bold">{reg.event.name}</p>
                            <p className="text-gray-400 text-sm">{reg.user.name}</p>
                            {!reg.isTeamEvent && (
  <p className={`text-sm font-bold ${reg.user.ticketType === 'VIP' ? 'text-amber-400' : 'text-gray-400'}`}>
    {reg.user.ticketType}
  </p>
)}

                          </div>
                          <div className="flex justify-between items-center">
                            {reg.isTeamEvent && (
  <span className="text-amber-400 text-sm">
    VIP: {reg.vipCount} | Regular: {reg.regularCount}
  </span>
)}

                            <span className={`text-sm font-bold ${reg.finalFee > 0 ? 'text-amber-400' : 'text-green-400'}`}>
                              {reg.finalFee > 0 ? `₹${reg.finalFee}` : 'Free'}
                            </span>
                          </div>
                          <div className="mt-2 pt-2 border-t border-amber-500/20">
                            <p className="text-sm text-gray-400">Transaction ID: {reg.transactionId}</p>
                          </div>
                          <div className="flex gap-2 mt-3">
  <button
    onClick={() => handleValidate('events', reg.id, 'APPROVED')}
    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full"
  >
    Validate
  </button>

  <button
    onClick={() => handleValidate('events', reg.id, 'REJECTED')}
    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full"
  >
    Reject
  </button>
</div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'manage-events' && (
            <motion.div
              key="manage-events"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Manage Events</h2>
                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setShowEventModal(true);
                  }}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
                >
                  <Calendar className="w-5 h-5" />
                  Add Event
                </button>
              </div>

              {events.length === 0 ? (
                <p className="text-gray-400 text-center py-20">No events available</p>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {events.map((event, index) => (
                    <div key={event.id} className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 font-bold text-lg">#{index + 1}</span>
                          <h3 className="text-xl font-bold text-white">{event.name}</h3>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingEvent(event);
                              setShowEventModal(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                        <div>
                          <p className="text-gray-400">Type:</p>
                          <p className="text-white">{event.isTeamEvent ? 'Team' : 'Solo'}</p>
                        </div>
                        {event.isTeamEvent && (
                          <div>
                            <p className="text-gray-400">Team Size:</p>
                            <p className="text-white">{event.teamSize}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-gray-400">Registration Fee:</p>
                          <p className="text-white">{event.registrationFee > 0 ? `₹${event.registrationFee}` : 'Free'}</p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-amber-500/20">
                        <p className="text-gray-400 mb-2">Description:</p>
                        <p className="text-white">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeSection === 'registrations' && (
            <motion.div
              key="registrations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Registrations</h2>

                {/* Toggle between Fest and Event Registrations */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => {
                      setRegistrationType('fest');
                      setSelectedEventId(null);
                      loadFestRegistrations();
                    }}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      registrationType === 'fest'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                        : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Users className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-sm">Zerone 2026</p>
                      <p className="font-bold">Registrations</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setRegistrationType('event');
                      setSelectedEventId(null);
                    }}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      registrationType === 'event'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                        : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-sm">Event</p>
                      <p className="font-bold">Registrations</p>
                    </div>
                  </button>
                </div>

                {/* Fest Registrations */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
  {festRegistrations.map((reg, index) => (
    <div
      key={reg.id}
      className="bg-white/5 rounded-xl p-4 border border-amber-500/30"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="text-amber-400 font-bold">#{index + 1}</span>
          <p className="text-white font-bold">{reg.name}</p>
          <p className="text-gray-400 text-sm">{reg.institution}</p>
        </div>
        <span className="text-sm font-bold text-gray-300">
          {reg.ticketType}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
        <div>
          <p className="text-gray-400">Phone</p>
          <p className="text-white">{reg.phone}</p>
        </div>
        <div>
          <p className="text-gray-400">District</p>
          <p className="text-white">{reg.district}</p>
        </div>
      </div>
    </div>
  ))}
</div>


                {/* Event Selection */}
                {registrationType === 'event' && !selectedEventId && (
                  <>
                    <div className="mb-4">
                      <p className="text-gray-400 text-sm">Select an event to view registrations:</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {events.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => {
  setSelectedEventId(event.id);
  loadEventRegistrations(event.id);
}}
                          className="bg-white/10 hover:bg-white/20 p-4 rounded-xl text-white transition-all"
                        >
                          <p className="font-bold">{event.name}</p>
                          <p className="text-xs text-gray-400 mt-1">Click to view registrations</p>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Event Registrations */}
                {registrationType === 'event' && selectedEventId && (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => setSelectedEventId(null)}
                        className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Back to events
                      </button>
                      {eventRegistrations.length > 0 && eventRegistrations[0].event && (
  <h3 className="text-xl font-bold text-white">
    {eventRegistrations[0].event.name}
  </h3>
)}

                    </div>

                    <div className="flex justify-end mb-4">
                      <button
                        onClick={() => exportRegistrations()}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Export CSV
                      </button>
                    </div>

                    {eventRegistrations.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">No registrations for this event yet</p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        <div className="space-y-4 max-h-96 overflow-y-auto">
  {eventRegistrations.map((reg, index) => (
  <div
    key={reg.id}
    className="bg-white/5 rounded-xl p-5 border border-amber-500/30"
  >
    {/* HEADER */}
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <span className="text-amber-400 font-bold">#{index + 1}</span>
        <span className="text-white font-bold">
          {reg.isTeamEvent ? 'TEAM' : 'SOLO'}
        </span>
      </div>

      <span
        className={`text-sm font-bold ${
          reg.isTeamEvent ? 'text-blue-400' : 'text-green-400'
        }`}
      >
        {reg.isTeamEvent ? 'Team Event' : 'Solo Event'}
      </span>
    </div>

    {/* ================= SOLO EVENT ================= */}
    {!reg.isTeamEvent && reg.user && (
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-400">Name</p>
          <p className="text-white">{reg.user.name}</p>
        </div>

        <div>
          <p className="text-gray-400">Institution</p>
          <p className="text-white">{reg.user.institution}</p>
        </div>

        <div className="col-span-2">
          <p className="text-gray-400">Phone</p>
          <p className="text-white">{reg.user.phone}</p>
        </div>
      </div>
    )}

    {/* ================= TEAM EVENT ================= */}
    {reg.isTeamEvent && (
      <div className="space-y-4">
        <p className="text-gray-400 text-sm">Team Members</p>

        {/* TEAM LEAD */}
        <div className="bg-black/40 rounded-lg p-3">
          <p className="text-white font-medium">
            {reg.user.name}{' '}
            <span className="text-xs text-amber-400">(Lead)</span>
          </p>
          <p className="text-gray-400 text-sm">{reg.user.institution}</p>
          <p className="text-gray-300 text-sm">{reg.user.phone}</p>
        </div>

        {/* OTHER MEMBERS */}
        {reg.teamMembers.map((m: any, i: number) => (
          <div key={i} className="bg-black/30 rounded-lg p-3">
            <p className="text-white font-medium">{m.memberName}</p>
            <p className="text-gray-400 text-sm">{m.user?.institution}</p>
            <p className="text-gray-300 text-sm">{m.user?.phone}</p>
          </div>
        ))}
      </div>
    )}
  </div>
))}


</div>

                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'attendees' && (
            <motion.div
              key="attendees"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Attendees</h2>
                  <button
                    onClick={exportAttendees}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold px-4 py-2 rounded-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>

                {/* Toggle between Zerone 2026 and Events */}
                <div className="flex gap-4 mb-6">
                  <button
                    onClick={() => {
                      setAttendeesType('zerone');
                      setSelectedAttendeeEventId(null);
                      loadFestAttendees();
                    }}
                    className={`flex-1 py-4 rounded-xl font-medium transition-all flex flex-col items-center gap-2 ${
                      attendeesType === 'zerone'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                        : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Crown className="w-6 h-6" />
                    <div>
                      <p className="text-xs">Fest</p>
                      <p className="font-bold">Zerone 2026</p>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setAttendeesType('event');
                      setSelectedAttendeeEventId(null);
                    }}
                    className={`flex-1 py-4 rounded-xl font-medium transition-all flex flex-col items-center gap-2 ${
                      attendeesType === 'event'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black'
                        : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Calendar className="w-6 h-6" />
                    <div>
                      <p className="text-xs">Select</p>
                      <p className="font-bold">Events</p>
                    </div>
                  </button>
                </div>

                {/* Zerone 2026 Attendees */}
                {attendeesType === 'zerone' && (
                  <>
                    {festAttendees.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No attendees marked for Zerone 2026 yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {festAttendees.map((attendee, index) => (
                          <div key={attendee.id} className="bg-white/5 rounded-xl p-4 border border-amber-500/30">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="text-amber-400 font-bold">#{index + 1}</span>
                                <p className="text-white font-bold">{attendee.name}</p>
                                <p className="text-gray-400 text-sm">{attendee.institution}</p>
                              </div>
                              <div className={`text-sm font-bold ${attendee.ticketType === 'VIP' ? 'text-amber-400' : 'text-white'}`}>
                                {attendee.ticketType}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-gray-300 text-sm">
                              <div>
                                <p className="text-gray-400">Ticket:</p>
                                <p className="text-white">{attendee.ticketNumber}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Phone:</p>
                                <p className="text-white">{attendee.phone}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-gray-400">Email:</p>
                                <p className="text-white">{attendee.email}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Event Selection */}
                {attendeesType === 'event' && !selectedAttendeeEventId && (
                  <>
                    <p className="text-gray-400 text-sm mb-4">Select an event to view attendees:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {events.map((event) => (
                        <button
                          key={event.id}
                          onClick={() => {
                            setSelectedAttendeeEventId(event.id);
                            loadEventAttendees(event.id);
                          }}
                          className="bg-white/10 hover:bg-white/20 p-4 rounded-xl text-white transition-all text-left"
                        >
                          <Calendar className="w-5 h-5 text-amber-400 mb-2" />
                          <p className="font-bold">{event.name}</p>
                          <p className="text-xs text-gray-400 mt-1">Click to view attendees</p>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* Event Attendees */}
                {attendeesType === 'event' && selectedAttendeeEventId && (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <button
                        onClick={() => setSelectedAttendeeEventId(null)}
                        className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Back to events
                      </button>
                      {eventAttendees.length > 0 && eventAttendees[0].eventName && (
                        <h3 className="text-xl font-bold text-white">{eventAttendees[0].eventName}</h3>
                      )}
                    </div>

                    {eventAttendees.length === 0 ? (
                      <div className="text-center py-12">
                        <CheckCircle2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No attendees marked for this event yet</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {eventAttendees.map((attendee, index) => (
                          
                          <div key={attendee.id} className="bg-white/5 rounded-xl p-4 border border-amber-500/30">
                           

                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <span className="text-amber-400 font-bold">#{index + 1}</span>
                                <p className="text-white font-bold">{attendee.name}</p>
                                <p className="text-gray-400 text-sm">{attendee.institution}</p>
                              </div>
                              <div className={`text-sm font-bold ${attendee.ticketType === 'VIP' ? 'text-amber-400' : 'text-white'}`}>
                                {attendee.ticketType}
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-gray-300 text-sm">
                              <div>
                                <p className="text-gray-400">Ticket:</p>
                                <p className="text-white">{attendee.ticketNumber}</p>
                              </div>
                              <div>
                                <p className="text-gray-400">Phone:</p>
                                <p className="text-white">{attendee.phone}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-gray-400">Email:</p>
                                <p className="text-white">{attendee.email}</p>
                              </div>
                            </div>
                          </div>
                          
                        ))}
                        
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'sponsors' && (
            <motion.div
              key="sponsors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Sponsors</h2>
                <button
                  onClick={() => {
                    setEditingSponsor(null);
                    setShowSponsorModal(true);
                  }}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
                >
                  <Award className="w-5 h-5" />
                  Add Sponsor
                </button>
              </div>

              {sponsors.length === 0 ? (
                <p className="text-gray-400 text-center py-20">No sponsors added yet</p>
              ) : (
                <div className="space-y-6">
                  {sponsors.map((sponsor) => (
                    <div key={sponsor.id} className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                          <div>
                            <p className={`text-lg font-bold ${sponsor.type === 'TITLE' ? 'text-amber-400' : 'text-white'}`}>
                              {sponsor.type.replace('_', ' ')}
                            </p>
                            <p className="text-gray-400 text-sm">{sponsor.name}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingSponsor(sponsor);
                                setShowSponsorModal(true);
                              }}
                              className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteSponsor(sponsor.id)}
                              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {sponsor.logoUrl && (
                        <img src={sponsor.logoUrl} alt={sponsor.name} className="w-24 h-24 mb-4 rounded-lg" />
                      )}
                      {sponsor.websiteUrl && (
                        <a href={sponsor.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 text-sm">
                          {sponsor.websiteUrl}
                        </a>
                      )}
                      {sponsor.eventName && (
                        <p className="text-gray-400 text-sm">Sponsoring: {sponsor.eventName}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeSection === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                <button
                  onClick={() => setShowContactModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all"
                >
                  <Phone className="w-5 h-5" />
                  Edit Contact Info
                </button>
              </div>

              <div className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-2xl p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-amber-400 mb-4">Student Coordinators</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400">Name:</p>
                        <p className="text-white">{contactInfo?.studentCoordinatorName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Phone:</p>
                        <p className="text-white">{contactInfo?.studentCoordinatorPhone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Email:</p>
                        <p className="text-white">{contactInfo?.studentCoordinatorEmail || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-amber-400 mb-4">Faculty Coordinators</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400">Name:</p>
                        <p className="text-white">{contactInfo?.facultyCoordinatorName || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Phone:</p>
                        <p className="text-white">{contactInfo?.facultyCoordinatorPhone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Email:</p>
                        <p className="text-white">{contactInfo?.facultyCoordinatorEmail || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 mt-8 pt-8 border-t border-amber-500/20">
                    <h3 className="text-lg font-bold text-amber-400 mb-4">Fest Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-gray-400">Fest Email:</p>
                        <p className="text-white">{contactInfo?.festEmail || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">College Email:</p>
                        <p className="text-white">{contactInfo?.collegeEmail || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">College Address:</p>
                        <p className="text-white">{contactInfo?.collegeAddress || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <AnimatePresence>
          {/* Event Modal */}
          {showEventModal && (
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
                className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/30 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingEvent ? 'Edit Event' : 'Add Event'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowEventModal(false);
                      setEditingEvent(null);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <EventForm
                  event={editingEvent}
                  onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
                  onCancel={() => {
                    setShowEventModal(false);
                    setEditingEvent(null);
                  }}
                />
              </motion.div>
            </motion.div>
          )}

          {/* Sponsor Modal */}
          {showSponsorModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowSponsorModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/30 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {editingSponsor ? 'Edit Sponsor' : 'Add Sponsor'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowSponsorModal(false);
                      setEditingSponsor(null);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <SponsorForm
                  sponsor={editingSponsor}
                  onSubmit={editingSponsor ? handleUpdateSponsor : handleAddSponsor}
                  onCancel={() => {
                    setShowSponsorModal(false);
                    setEditingSponsor(null);
                  }}
                />
              </motion.div>
            </motion.div>
          )}

          {/* Contact Modal */}
          {showContactModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowContactModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-gray-900 to-black border border-amber-500/30 rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">Edit Contact Information</h2>
                  <button
                    onClick={() => setShowContactModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <ContactForm
                  contactInfo={contactInfo}
                  onSubmit={handleUpdateContact}
                  onCancel={() => setShowContactModal(false)}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

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

function EventForm({ event, onSubmit, onCancel }: { event: any; onSubmit: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    isTeamEvent: false,
    teamSize: '',
    rewardPool: '',
    registrationFee: '',
    time: '',
    venue: '',
    description: '',
    coordinator1Name: '',
    coordinator1Phone: '',
    coordinator2Name: '',
    coordinator2Phone: '',
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        isTeamEvent: event.isTeamEvent,
        teamSize: event.teamSize || '',
        rewardPool: event.rewardPool || '',
        registrationFee: event.registrationFee || '',
        time: event.time || '',
        venue: event.venue || '',
        description: event.description || '',
        coordinator1Name: event.coordinator1Name || '',
        coordinator1Phone: event.coordinator1Phone || '',
        coordinator2Name: event.coordinator2Name || '',
        coordinator2Phone: event.coordinator2Phone || '',
      });
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Event Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
          placeholder="Enter event name"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Type *</label>
          <select
            required
            value={formData.isTeamEvent ? 'team' : 'solo'}
            onChange={(e) => setFormData({ ...formData, isTeamEvent: e.target.value === 'team' })}
            className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
          >
            <option value="solo">Solo Event</option>
            <option value="team">Team Event</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
          <input
            type="number"
            value={formData.teamSize}
            onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
            disabled={!formData.isTeamEvent}
            className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 disabled:opacity-50"
            placeholder="Enter team size"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Reward Pool *</label>
          <input
            type="text"
            required
            value={formData.rewardPool}
            onChange={(e) => setFormData({ ...formData, rewardPool: e.target.value })}
            className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            placeholder="Enter reward pool"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Registration Fee *</label>
          <input
            type="number"
            required
            value={formData.registrationFee}
            onChange={(e) => setFormData({ ...formData, registrationFee: e.target.value })}
            className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            placeholder="Enter fee (0 for free)"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Time *</label>
          <input
            type="text"
            required
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            placeholder="Enter event time"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Venue *</label>
          <input
            type="text"
            required
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            placeholder="Enter venue"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 resize-none"
          placeholder="Enter event description"
        />
      </div>

      <div className="pt-4 border-t border-amber-500/20">
        <h3 className="text-lg font-bold text-white mb-4">Coordinators</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Coordinator 1 Name *</label>
            <input
              type="text"
              required
              value={formData.coordinator1Name}
              onChange={(e) => setFormData({ ...formData, coordinator1Name: e.target.value })}
              className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
              placeholder="Enter name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Coordinator 1 Phone *</label>
            <input
              type="tel"
              required
              value={formData.coordinator1Phone}
              onChange={(e) => setFormData({ ...formData, coordinator1Phone: e.target.value })}
              className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
              placeholder="Enter phone"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Coordinator 2 Name</label>
            <input
              type="text"
              value={formData.coordinator2Name}
              onChange={(e) => setFormData({ ...formData, coordinator2Name: e.target.value })}
              className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
              placeholder="Enter name (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Coordinator 2 Phone</label>
            <input
              type="tel"
              value={formData.coordinator2Phone}
              onChange={(e) => setFormData({ ...formData, coordinator2Phone: e.target.value })}
              className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
              placeholder="Enter phone (optional)"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold py-3 rounded-xl transition-all"
        >
          {event ? 'Update Event' : 'Create Event'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-white/10 hover:bg-white/20 text-gray-400 px-6 py-3 rounded-xl transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function SponsorForm({ sponsor, onSubmit, onCancel }: { sponsor: any; onSubmit: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    websiteUrl: '',
    type: 'TITLE',
    eventName: '',
  });

  useEffect(() => {
    if (sponsor) {
      setFormData({
        name: sponsor.name || '',
        logoUrl: sponsor.logoUrl || '',
        websiteUrl: sponsor.websiteUrl || '',
        type: sponsor.type || 'TITLE',
        eventName: sponsor.eventName || '',
      });
    }
  }, [sponsor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Sponsor Name *</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
          placeholder="Enter sponsor name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Sponsor Type *</label>
        <select
          required
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
        >
          <option value="TITLE">Title Sponsor</option>
          <option value="CO_SPONSOR">Co-Sponsor</option>
          <option value="EVENT_SPONSOR">Event Sponsor</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Logo URL</label>
        <input
          type="url"
          value={formData.logoUrl}
          onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
          className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
          placeholder="Enter logo URL"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Website URL</label>
        <input
          type="url"
          value={formData.websiteUrl}
          onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
          className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
          placeholder="Enter website URL"
        />
      </div>

      {formData.type === 'EVENT_SPONSOR' && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Sponsoring Event</label>
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
            className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            placeholder="Enter event name"
          />
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold py-3 rounded-xl transition-all"
        >
          {sponsor ? 'Update Sponsor' : 'Add Sponsor'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-white/10 hover:bg-white/20 text-gray-400 px-6 py-3 rounded-xl transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function ContactForm({ contactInfo, onSubmit, onCancel }: { contactInfo: any; onSubmit: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    studentCoordinatorName: '',
    studentCoordinatorPhone: '',
    studentCoordinatorEmail: '',
    facultyCoordinatorName: '',
    facultyCoordinatorPhone: '',
    facultyCoordinatorEmail: '',
    festEmail: '',
    collegeEmail: '',
    collegeAddress: '',
  });

  useEffect(() => {
    if (contactInfo) {
      setFormData({
        studentCoordinatorName: contactInfo.studentCoordinatorName || '',
        studentCoordinatorPhone: contactInfo.studentCoordinatorPhone || '',
        studentCoordinatorEmail: contactInfo.studentCoordinatorEmail || '',
        facultyCoordinatorName: contactInfo.facultyCoordinatorName || '',
        facultyCoordinatorPhone: contactInfo.facultyCoordinatorPhone || '',
        facultyCoordinatorEmail: contactInfo.facultyCoordinatorEmail || '',
        festEmail: contactInfo.festEmail || '',
        collegeEmail: contactInfo.collegeEmail || '',
        collegeAddress: contactInfo.collegeAddress || '',
      });
    }
  }, [contactInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Student Coordinator Name *</label>
          <input
            type="text"
            required
            value={formData.studentCoordinatorName}
            onChange={(e) => setFormData({ ...formData, studentCoordinatorName: e.target.value })}
            className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            placeholder="Enter name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Student Coordinator Phone *</label>
          <input
            type="tel"
            required
            value={formData.studentCoordinatorPhone}
            onChange={(e) => setFormData({ ...formData, studentCoordinatorPhone: e.target.value })}
            className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            placeholder="Enter phone"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Student Coordinator Email</label>
          <input
            type="email"
            required
            value={formData.studentCoordinatorEmail}
            onChange={(e) => setFormData({ ...formData, studentCoordinatorEmail: e.target.value })}
            className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Faculty Coordinator Name</label>
          <input
            type="text"
            value={formData.facultyCoordinatorName}
            onChange={(e) => setFormData({ ...formData, facultyCoordinatorName: e.target.value })}
            className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            placeholder="Enter name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Faculty Coordinator Phone</label>
          <input
            type="tel"
            value={formData.facultyCoordinatorPhone}
            onChange={(e) => setFormData({ ...formData, facultyCoordinatorPhone: e.target.value })}
            className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            placeholder="Enter phone"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Faculty Coordinator Email</label>
          <input
            type="email"
            value={formData.facultyCoordinatorEmail}
            onChange={(e) => setFormData({ ...formData, facultyCoordinatorEmail: e.target.value })}
            className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
            placeholder="Enter email"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-amber-500/20">
        <h3 className="text-lg font-bold text-white mb-4">Fest Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fest Email *</label>
            <input
              type="email"
              required
              value={formData.festEmail}
              onChange={(e) => setFormData({ ...formData, festEmail: e.target.value })}
              className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
              placeholder="Enter fest email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">College Email *</label>
            <input
              type="email"
              required
              value={formData.collegeEmail}
              onChange={(e) => setFormData({ ...formData, collegeEmail: e.target.value })}
              className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400"
              placeholder="Enter college email"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 mb-2">College Address *</label>
          <textarea
            required
            value={formData.collegeAddress}
            onChange={(e) => setFormData({ ...formData, collegeAddress: e.target.value })}
            rows={2}
            className="w-full bg-white/10 border border-amber-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 resize-none"
            placeholder="Enter college address"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold py-3 rounded-xl transition-all"
        >
          Update Contact Information
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-white/10 hover:bg-white/20 text-gray-400 px-6 py-3 rounded-xl transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
