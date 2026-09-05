CREATE TABLE IF NOT EXISTS pgs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500),
  latitude DOUBLE,
  longitude DOUBLE,
  google_map_link VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_pgs_lat_lng ON pgs(latitude, longitude);
