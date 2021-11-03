/**
 * @typedef {"mention" | "hashtag" | "cashtag" | "bot_command" | "url" | "email" | "phone_number" | "bold" | "italic" | "underline" | "strikethrough" | "code" | "pre" | "text_link" | "text_mention"} MessageEntityType
 */

/**
 * Models a user entity
 */
class User {
  /**
   *
   * @param {number} id - Unique identifier for this user or bot.
   * @param {boolean} isBot - True if this user is a bot
   * @param {string} firstName - User or bot's first name
   * @param {string} [lastName] - (Optional) User or bot's last name
   * @param {string} [username] - (Optional) User or bot's username
   * @param {string} [languageCode] - (Optional) IETF language tag of the user's language
   * @param {boolean} [canJoinGroups] - (Optional) True if the bot can be invited to groups. Returned only in getMe
   * @param {boolean} [canReadAllGroupMessages] - (Optional) True if privacy mode is disabled for the bot. Returned only in getMe
   * @param {boolean} [supportsInlineQueries] - (Optional) True if the bot supports inline queries. Returned Only in getMe.
   */
  constructor(
    id,
    isBot,
    firstName,
    lastName,
    username,
    languageCode,
    canJoinGroups,
    canReadAllGroupMessages,
    supportsInlineQueries,
  ) {
    this.id = id;
    this.is_bot = isBot;
    this.first_name = firstName;
    if (lastName != null) this.lastName = lastName;
    if (username != null) this.username = username;
    if (languageCode != null) this.language_code = languageCode;
    if (canJoinGroups != null) this.can_join_groups = canJoinGroups;
    if (canReadAllGroupMessages != null) {
      this.can_read_all_group_messages = canReadAllGroupMessages;
    }
    if (supportsInlineQueries != null) {
      this.supports_inline_queries = supportsInlineQueries;
    }
  }
}

/**
 * Models a MessageEntity object
 */
class MessageEntity {
  /**
   *
   * @param {MessageEntityType} type - Type of the entity. Can be “mention” (@username), “hashtag” (#hashtag), “cashtag” ($USD), “bot_command” (/start@jobs_bot), “url” (https://telegram.org), “email” (do-not-reply@telegram.org), “phone_number” (+1-212-555-0123), “bold” (bold text), “italic” (italic text), “underline” (underlined text), “strikethrough” (strikethrough text), “code” (monowidth string), “pre” (monowidth block), “text_link” (for clickable text URLs), “text_mention” (for users without usernames)
   * @param {number} offset - Offset in UTF-16 code units to the start of the entity
   * @param {number} length - Length of the entity in UTF-16 code units
   * @param {string} [url] - (Optional) For "text_link" only, url that will be opened after user taps on the text
   * @param {User} [user] - (Optional) For "text_mention" only, the mentioned user
   * @param {string} [language] - (Optional) For "pre" only, the programing language of the entity text
   */
  constructor(type, offset, length, url, user, language) {
    this.type = type;
    this.offset = offset;
    this.length = length;
    if (url != null) this.url = url;
    if (user != null) this.user = user;
    if (language != null) this.language = language;
  }
}

module.exports = {
  User,
  MessageEntity,
};
