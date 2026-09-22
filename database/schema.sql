-- Eventify database schema (MySQL 8+)

CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('organizer', 'attendee') NOT NULL DEFAULT 'attendee',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS events (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  organizer_id  INT NOT NULL,
  title         VARCHAR(160) NOT NULL,
  description   TEXT,
  category      VARCHAR(60) NOT NULL,
  venue         VARCHAR(160) NOT NULL,
  city          VARCHAR(100) NOT NULL,
  event_date    DATE NOT NULL,
  event_time    TIME NOT NULL,
  price         DECIMAL(10,2) NOT NULL DEFAULT 0,
  capacity      INT NOT NULL DEFAULT 50,
  cover_color   VARCHAR(20) DEFAULT '#2A7F6B',
  status        ENUM('published', 'draft', 'cancelled') NOT NULL DEFAULT 'published',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_events_date (event_date),
  INDEX idx_events_category (category),
  INDEX idx_events_city (city)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS registrations (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  event_id      INT NOT NULL,
  user_id       INT NOT NULL,
  quantity      INT NOT NULL DEFAULT 1,
  ticket_code   VARCHAR(20) NOT NULL UNIQUE,
  status        ENUM('confirmed', 'cancelled') NOT NULL DEFAULT 'confirmed',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uniq_event_user (event_id, user_id)
) ENGINE=InnoDB;
