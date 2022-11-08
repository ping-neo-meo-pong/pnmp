CREATE TABLE "User" (
	"id"	INT	primary key,
	"createdAt"	DATE	default now()	NULL,
	"updatedAt"	DATE	default now()	NULL,
	"createdId"	VARCHAR(255)	NULL,
	"updatedId"	VARCHAR(255)	NULL,
	"role_id"	INT	NOT NULL,
	"nickname"	VARCHAR(50)	NULL,
	"userName"	VARCHAR(50)	NULL,
	"apiId"	VARCHAR(50)	NULL,
	"profileImage"	VARCHAR(255)	NULL,
	"participate"	BOOLEAN	NULL,
	"eMail"	VARCHAR(50)	NULL
);

CREATE TABLE "Channel" (
	"id"	INT	primary key,
	"createdAt"	TIMESTAMP	default now()	NULL,
	"updatedAt"	TIMESTAMP	default now()	NULL,
	"createdId"	VARCHAR(255)	NULL,
	"updatedId"	VARCHAR(255)	NULL,
	"deletedAt"	TIMESTAMP	NULL,
	"channelName"	VARCHAR(50)	NULL,
	"channelPw"	VARCHAR(50)	NULL,
	"description"	VARCHAR(50)	NULL,
	"isPublic"	BOOLEAN	NULL
);

CREATE TABLE "Role" (
	"id"	INT	primary key,
	"createdAt"	TIMESTAMP	default now()	NULL,
	"updatedAt"	TIMESTAMP	default now()	NULL,
	"createdId"	VARCHAR(255)	NULL,
	"updatedId"	VARCHAR(255)	NULL,
	"role"	VARCHAR(50)	NULL
);

CREATE TABLE "ChannelMember" (
	"id"	INT	primary key,
	"createdAt"	TIMESTAMP	default now()	NULL,
	"updatedAt"	TIMESTAMP	default now()	NULL,
	"createdId"	VARCHAR(255)	NULL,
	"updatedId"	VARCHAR(255)	NULL,
	"user_id"	INT	NOT NULL,
	"channel_id"	INT	NOT NULL,
	"role_id"	INT	NOT NULL,
	"muteEndTime"	TIMESTAMP	NULL,
	"banEndTime"	TIMESTAMP	NULL,
	"joinTime"	TIMESTAMP	NULL,
	"leftTime"	TIMESTAMP	NULL
);

CREATE TABLE "ChannelMessage" (
	"id"	INT	primary key,
	"createdAt"	TIMESTAMP	default now()	NULL,
	"updatedAt"	TIMESTAMP	default now()	NULL,
	"createdId"	VARCHAR(255)	NULL,
	"updatedId"	VARCHAR(255)	NULL,
	"message"	VARCHAR(255)	NULL,
	"channel_id"	INT	NOT NULL
);

CREATE TABLE "DmRoom" (
	"id"	INT	primary key,
	"createdAt"	TIMESTAMP	default now()	NULL,
	"updatedAt"	TIMESTAMP	default now()	NULL,
	"createdId"	VARCHAR(255)	NULL,
	"updatedId"	VARCHAR(255)	NULL,
	"user1LeftTime"	TIMESTAMP	NULL,
	"user2LeftTime"	TIMESTAMP	NULL
);

CREATE TABLE "DmMessage" (
	"id"	INT	primary key,
	"createdAt"	TIMESTAMP	default now()	NULL,
	"updatedAt"	TIMESTAMP	default now()	NULL,
	"createdId"	VARCHAR(255)	NULL,
	"updatedId"	VARCHAR(255)	NULL,
	"dmRoom_id"	INT	NOT NULL,
	"sendUser_id"	INT	NOT NULL,
	"receiveUser_id"	INT	NOT NULL,
	"message"	VARCHAR(255)	NULL
);

CREATE TABLE "GameRoom" (
	"id"	INT	primary key,
	"createdAt"	TIMESTAMP	default now()	NULL,
	"updatedAt"	TIMESTAMP	default now()	NULL,
	"createdId"	VARCHAR(255)	NULL,
	"updatedId"	VARCHAR(255)	NULL,
	"gameMode"	VARCHAR(50)	NULL
);

CREATE TABLE "MatchingHistory" (
	"id"	INT	primary key,
	"createdAt"	TIMESTAMP	default now()	NULL,
	"updatedAt"	TIMESTAMP	default now()	NULL,
	"createdId"	VARCHAR(255)	NULL,
	"updatedId"	VARCHAR(255)	NULL,
	"game_room_id"	INT	NOT NULL,
	"player1"	INT	NOT NULL,
	"player2"	INT	NOT NULL,
	"Start_time"	TIMESTAMP	NULL,
	"Finished_time"	TIMESTAMP	NULL
);

CREATE TABLE "FriendList" (
	"id"	INT	primary key,
	"createdAt"	TIMESTAMP	default now()	NULL,
	"updatedAt"	TIMESTAMP	default now()	NULL,
	"createdId"	VARCHAR(255)	NULL,
	"updatedId"	VARCHAR(255)	NULL,
	"user_id"	INT	NOT NULL,
	"user_friend_id"	INT	NOT NULL,
	"requestTime"	TIMESTAMP	NULL,
	"acceptTime"	TIMESTAMP	NULL,
	"crossFriend"	BOOLEAN	NULL
);

CREATE TABLE "BanList" (
	"id"	INT	primary key,
	"createdAt"	TIMESTAMP	default now()	NULL,
	"updatedAt"	TIMESTAMP	default now()	NULL,
	"createdId"	VARCHAR(255)	NULL,
	"updatedId"	VARCHAR(255)	NULL,
	"user_id"	INT	NOT NULL,
	"ban_user_id"	INT	NOT NULL,
	"blockTime"	TIMESTAMP	NULL
);

CREATE TABLE "Score" (
	"id"	INT	primary key,
	"createdAt"	TIMESTAMP	default now()	NULL,
	"updatedAt"	TIMESTAMP	default now()	NULL,
	"createdId"	VARCHAR(255)	NULL,
	"updatedId"	VARCHAR(255)	NULL,
	"user_id"	INT	NOT NULL,
	"matchingHistory_id"	INT	NOT NULL,
	-- "role_id"	INT	NOT NULL,
	"win"	BOOLEAN	NULL,
	"score"	INT	NULL,
	"ladderScore"	INT	NULL
);

-- ALTER TABLE "User" ADD CONSTRAINT "PK_USER" PRIMARY KEY (
-- 	"id",
-- 	"role_id"
-- );

-- ALTER TABLE "Channel" ADD CONSTRAINT "PK_CHANNEL" PRIMARY KEY (
-- 	"channel_id"
-- );

-- ALTER TABLE "Role" ADD CONSTRAINT "PK_ROLE" PRIMARY KEY (
-- 	"role_id"
-- );

-- ALTER TABLE "ChannelMember" ADD CONSTRAINT "PK_CHANNEL MEMBER" PRIMARY KEY (
-- 	"Channel_member_id",
-- 	"user_id",
-- 	"channel_id",
-- 	"role_id",
-- );

-- ALTER TABLE "ChannelMessage" ADD CONSTRAINT "PK_CHANNEL MESSAGE" PRIMARY KEY (
-- 	"channel_message_id",
-- 	"channel_id"
-- );

-- ALTER TABLE "DM Room" ADD CONSTRAINT "PK_DM ROOM" PRIMARY KEY (
-- 	"id"
-- );

-- ALTER TABLE "DmMessage" ADD CONSTRAINT "PK_DM MESSAGE" PRIMARY KEY (
-- 	"Dm_Message_ID",
-- 	"dmRoom_id"
-- );

-- ALTER TABLE "GameRoom" ADD CONSTRAINT "PK_GAME ROOM" PRIMARY KEY (
-- 	"game_id"
-- );

-- ALTER TABLE "MatchingHistory" ADD CONSTRAINT "PK_MATCHING HISTORY" PRIMARY KEY (
-- 	"game_id",
-- );

-- ALTER TABLE "FriendList" ADD CONSTRAINT "PK_FRIENDLIST" PRIMARY KEY (
-- 	"friend_id"
-- );

-- ALTER TABLE "BanList" ADD CONSTRAINT "PK_BANLIST" PRIMARY KEY (
-- 	"Block_id"
-- );

-- ALTER TABLE "Score" ADD CONSTRAINT "PK_SCORE" PRIMARY KEY (
-- 	"id",
-- 	"user_id",
-- 	"matchingHistory_id",
-- 	"role_id"
-- );

ALTER TABLE "User" ADD CONSTRAINT "FK_Role_TO_User_1" FOREIGN KEY (
	"role_id"
)
REFERENCES "Role" (
	"id"
);

ALTER TABLE "ChannelMember" ADD CONSTRAINT "FK_User_TO_ChannelMember_1" FOREIGN KEY (
	"user_id"
)
REFERENCES "User" (
	"id"
);

ALTER TABLE "ChannelMember" ADD CONSTRAINT "FK_channel_TO_ChannelMember_1" FOREIGN KEY (
	"channel_id"
)
REFERENCES "Channel" (
	"id"
);

ALTER TABLE "ChannelMember" ADD CONSTRAINT "FK_Role_TO_ChannelMember_1" FOREIGN KEY (
	"role_id"
)
REFERENCES "Role" (
	"id"
);

ALTER TABLE "ChannelMessage" ADD CONSTRAINT "FK_channel_TO_ChannelMessage_1" FOREIGN KEY (
	"channel_id"
)
REFERENCES "Channel" (
	"id"
);

ALTER TABLE "DmMessage" ADD CONSTRAINT "FK_DMRoom_TO_DmMessage_1" FOREIGN KEY (
	"dmRoom_id"
)
REFERENCES "DmRoom" (
	"id"
);

ALTER TABLE "MatchingHistory" ADD CONSTRAINT "FK_GameRoom_TO_Matching History_1" FOREIGN KEY (
	"game_room_id"
)
REFERENCES "GameRoom" (
	"id"
);

ALTER TABLE "Score" ADD CONSTRAINT "FK_User_TO_Score_1" FOREIGN KEY (
	"user_id"
)
REFERENCES "User" (
	"id"
);

ALTER TABLE "Score" ADD CONSTRAINT "FK_MatchingHistory_TO_Score_1" FOREIGN KEY (
	"matchingHistory_id"
)
REFERENCES "MatchingHistory" (
	"id"
);

-- ALTER TABLE "Score" ADD CONSTRAINT "FK_User_TO_Score_2" FOREIGN KEY (
-- 	"role_id"
-- )
-- REFERENCES "User" (
-- 	"role_id"
-- );
