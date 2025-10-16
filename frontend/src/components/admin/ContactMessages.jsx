// src/components/admin/ContactMessages.js
// Admin component to view and manage contact messages

import React, { useState, useEffect } from 'react';
import API from '../../services/api-service';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({ unreadCount: 0 });

  useEffect(() => {
    fetchMessages();
  }, [filter]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === 'unread') params.isRead = 'false';
      if (filter === 'read') params.isRead = 'true';
      
      const response = await API.get('/contact/admin', { params });
      setMessages(response.data.data);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await API.put(`/contact/admin/${messageId}`, { isRead: true });
      fetchMessages();
      if (selectedMessage?._id === messageId) {
        setSelectedMessage({ ...selectedMessage, isRead: true });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await API.delete(`/contact/admin/${messageId}`);
      setMessages(messages.filter(m => m._id !== messageId));
      if (selectedMessage?._id === messageId) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div>Loading messages...</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ margin: 0 }}>
          Contact Messages ({messages.length})
          {stats.unreadCount > 0 && (
            <span style={{
              marginLeft: '0.5rem',
              padding: '0.25rem 0.5rem',
              background: '#dc3545',
              color: 'white',
              borderRadius: '12px',
              fontSize: '0.8rem'
            }}>
              {stats.unreadCount} new
            </span>
          )}
        </h2>
      </div>

      {/* Filter Buttons */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {['all', 'unread', 'read'].map(filterType => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            style={{
              padding: '0.5rem 1rem',
              border: filter === filterType ? '2px solid #007bff' : '2px solid #e9ecef',
              background: filter === filterType ? '#007bff' : 'white',
              color: filter === filterType ? 'white' : '#333',
              borderRadius: '6px',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {filterType} {filterType === 'unread' && stats.unreadCount > 0 && `(${stats.unreadCount})`}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Messages List */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          maxHeight: '70vh',
          overflowY: 'auto'
        }}>
          {messages.length > 0 ? (
            messages.map(message => (
              <div
                key={message._id}
                onClick={() => setSelectedMessage(message)}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid #e9ecef',
                  cursor: 'pointer',
                  background: selectedMessage?._id === message._id 
                    ? '#e3f2fd' 
                    : message.isRead ? 'white' : '#f8f9fa',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (selectedMessage?._id !== message._id) {
                    e.target.style.background = '#f0f0f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedMessage?._id !== message._id) {
                    e.target.style.background = message.isRead ? 'white' : '#f8f9fa';
                  }
                }}
              >
                {!message.isRead && (
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    width: '8px',
                    height: '8px',
                    background: '#dc3545',
                    borderRadius: '50%'
                  }}></div>
                )}
                
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '0.5rem'
                }}>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{message.name}</h4>
                  <small style={{ color: '#6c757d' }}>
                    {formatDate(message.createdAt)}
                  </small>
                </div>
                
                <p style={{
                  margin: '0 0 0.5rem 0',
                  color: '#6c757d',
                  fontSize: '0.9rem'
                }}>
                  {message.email}
                </p>
                
                <p style={{
                  margin: '0',
                  fontWeight: message.isRead ? 'normal' : '500',
                  fontSize: '0.95rem'
                }}>
                  {message.subject}
                </p>
                
                <p style={{
                  margin: '0.5rem 0 0 0',
                  color: '#6c757d',
                  fontSize: '0.85rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {message.message}
                </p>
              </div>
            ))
          ) : (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              color: '#6c757d'
            }}>
              No messages found.
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          padding: selectedMessage ? '2rem' : '3rem',
          textAlign: selectedMessage ? 'left' : 'center'
        }}>
          {selectedMessage ? (
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '2rem'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{selectedMessage.subject}</h3>
                  <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                    From: <strong>{selectedMessage.name}</strong> ({selectedMessage.email})
                  </div>
                  <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                    {formatDate(selectedMessage.createdAt)}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!selectedMessage.isRead && (
                    <button
                      onClick={() => markAsRead(selectedMessage._id)}
                      style={{
                        padding: '0.5rem 1rem',
                        background: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(selectedMessage._id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div style={{
                padding: '1.5rem',
                background: '#f8f9fa',
                borderRadius: '8px',
                lineHeight: '1.6'
              }}>
                {selectedMessage.message}
              </div>
              
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#e3f2fd',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}>
                <strong>Quick Reply:</strong>
                <div style={{ marginTop: '0.5rem' }}>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}&body=Hi ${selectedMessage.name},%0D%0A%0D%0AThank you for your message.%0D%0A%0D%0ABest regards`}
                    style={{
                      display: 'inline-block',
                      padding: '0.5rem 1rem',
                      background: '#007bff',
                      color: 'white',
                      textDecoration: 'none',
                      borderRadius: '4px'
                    }}
                  >
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📬</div>
              <p style={{ color: '#6c757d' }}>
                Select a message to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
