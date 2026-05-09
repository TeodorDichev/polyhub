-- CREATE DATABASE polyhub;

CREATE TABLE user_roles (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

INSERT INTO user_roles (name) VALUES
('PARTY_ADMIN'),
('ADMIN'),
('POLYHUB_SPECIALIST');

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    firstname TEXT NOT NULL,
    lastname TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_user_role
        FOREIGN KEY (role_id)
        REFERENCES user_roles(id)
);

CREATE TABLE party_statuses (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

INSERT INTO party_statuses (name) VALUES
('PENDING'),
('APPROVED'),
('REJECTED'); -- probably redundant, rejecting parties will probably delete them

CREATE TABLE parties (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    motto TEXT,
    description TEXT NOT NULL,
    logo_url TEXT,
    founded_on DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    status_id BIGINT NOT NULL,
    created_by BIGINT NOT NULL,

    self_economic_axis DOUBLE PRECISION, -- -1.00 to 1.00
    self_social_axis DOUBLE PRECISION,   -- -1.00 to 1.00

	spec_economic_axis DOUBLE PRECISION, -- -1.00 to 1.00
    spec_social_axis DOUBLE PRECISION,   -- -1.00 to 1.00

    CONSTRAINT fk_party_status
        FOREIGN KEY (status_id)
        REFERENCES party_statuses(id),

    CONSTRAINT fk_party_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
);

CREATE TABLE party_member_roles (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

INSERT INTO party_member_roles (name) VALUES
('CHAIRMAN'),
('VICE_CHAIRMAN'),
('MEMBER');

CREATE TABLE party_members (
    id BIGSERIAL PRIMARY KEY,
    party_id BIGINT NOT NULL,
    name TEXT NOT NULL,
    role_id BIGINT NOT NULL,
    bio TEXT,

    CONSTRAINT fk_member_party
        FOREIGN KEY (party_id)
        REFERENCES parties(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_member_role
        FOREIGN KEY (role_id)
        REFERENCES party_member_roles(id)
);

CREATE TABLE election_types (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

INSERT INTO election_types (name) VALUES
('PARLIAMENTARY'),
('PRESIDENTIAL'),
('MAYORAL'),
('MUNICIPAL_COUNCIL');

CREATE TABLE elections (
    id BIGSERIAL PRIMARY KEY,
    type_id BIGINT NOT NULL,
    name TEXT NOT NULL,
    election_date DATE NOT NULL,
    description TEXT,

    CONSTRAINT fk_election_type
        FOREIGN KEY (type_id)
        REFERENCES election_types(id)
);

CREATE TABLE party_participations (
    id BIGSERIAL PRIMARY KEY,
    party_id BIGINT NOT NULL,
    election_id BIGINT NOT NULL,

    CONSTRAINT fk_pp_party
        FOREIGN KEY (party_id)
        REFERENCES parties(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pp_election
        FOREIGN KEY (election_id)
        REFERENCES elections(id)
        ON DELETE CASCADE
);

CREATE TABLE programs (
    id BIGSERIAL PRIMARY KEY,
    party_id BIGINT NOT NULL,
	election_id BIGINT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    last_edit_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	self_economic_axis DOUBLE PRECISION, -- -1.00 to 1.00
    self_social_axis DOUBLE PRECISION,   -- -1.00 to 1.00

	spec_economic_axis DOUBLE PRECISION, -- -1.00 to 1.00
    spec_social_axis DOUBLE PRECISION,   -- -1.00 to 1.00

	CONSTRAINT fk_program_election
        FOREIGN KEY (election_id)
        REFERENCES elections(id)
        ON DELETE CASCADE,
		
    CONSTRAINT fk_program_party
        FOREIGN KEY (party_id)
        REFERENCES parties(id)
        ON DELETE CASCADE
);

CREATE TABLE policies (
    id BIGSERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
	
	self_economic_axis DOUBLE PRECISION, -- -1.00 to 1.00
    self_social_axis DOUBLE PRECISION,   -- -1.00 to 1.00

	spec_economic_axis DOUBLE PRECISION, -- -1.00 to 1.00
    spec_social_axis DOUBLE PRECISION   -- -1.00 to 1.00
);

CREATE TABLE program_policies (
    program_id BIGINT NOT NULL,
    policy_id BIGINT NOT NULL,

    PRIMARY KEY (program_id, policy_id),

    CONSTRAINT fk_pt_program
        FOREIGN KEY (program_id)
        REFERENCES programs(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_pt_policies
        FOREIGN KEY (policy_id)
        REFERENCES policies(id)
        ON DELETE CASCADE
);