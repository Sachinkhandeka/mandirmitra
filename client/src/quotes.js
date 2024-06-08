const hinduQuotes = [
    { quote: "Do your duty without expecting rewards.", source: "Lord Krishna (Bhagavad Gita)" },
    { quote: "I appear on earth to protect the good and destroy evil.", source: "Lord Krishna (Bhagavad Gita)" },
    { quote: "Surrender to me, and I will free you from all sins.", source: "Lord Krishna (Bhagavad Gita)" },
    { quote: "A promise must never be broken.", source: "Lord Rama (Valmiki Ramayana)" },
    { quote: "Control your desires and anger to avoid destruction.", source: "Lord Rama (Valmiki Ramayana)" },
    { quote: "True love is helping others without expecting anything.", source: "Lord Rama (Valmiki Ramayana)" },
    { quote: "I am eternal, without beginning or end.", source: "Lord Shiva (Shiva Purana)" },
    { quote: "Meditation brings wisdom, ignorance comes from lack of it.", source: "Lord Shiva (Shiva Purana)" },
    { quote: "Find happiness within yourself.", source: "Lord Shiva (Shiva Purana)" },
    { quote: "I preserve the universe and protect it from evil.", source: "Lord Vishnu (Vishnu Purana)" },
    { quote: "Serve with devotion and strength.", source: "Lord Hanuman (Ramayana)" },
    { quote: "Prosperity comes to those who work hard and stay honest.", source: "Goddess Lakshmi (Lakshmi Pooja)" },
    { quote: "Seek knowledge, and wisdom will follow.", source: "Goddess Saraswati (Saraswati Vandana)" },
    { quote: "I destroy evil and protect the good.", source: "Goddess Durga (Durga Saptashati)" },
    { quote: "Remove obstacles with wisdom and patience.", source: "Lord Ganesha (Ganesha Upanishad)" },
    { quote: "Those who worship me with devotion will get what they need.", source: "Lord Krishna (Bhagavad Gita)" },
    { quote: "I am both the creator and destroyer of the universe.", source: "Lord Shiva (Shiva Mahapurana)" },
    { quote: "Love and devotion can move mountains.", source: "Goddess Parvati (Parvati Stotram)" },
    { quote: "Lift yourself by your own efforts.", source: "Lord Krishna (Bhagavad Gita)" },
    { quote: "I take many forms to protect the world.", source: "Lord Vishnu (Bhagavata Purana)" },
    { quote: "Patience is the ornament of the brave.", source: "Lord Rama (Valmiki Ramayana)" },
    { quote: "Victory belongs to those who persevere.", source: "Goddess Durga (Durga Saptashati)" },
    { quote: "Your mind is your best friend and worst enemy.", source: "Lord Krishna (Bhagavad Gita)" },
    { quote: "Faith can move mountains.", source: "Lord Hanuman (Ramayana)" },
    { quote: "Compassion is the root of Dharma.", source: "Lord Buddha (Dhammapada)" },
    { quote: "Knowledge is the greatest wealth.", source: "Goddess Saraswati (Saraswati Vandana)" },
    { quote: "Serve the world and seek the divine within.", source: "Swami Vivekananda (Teachings)" },
    { quote: "Inner peace leads to outer harmony.", source: "Lord Shiva (Shiva Purana)" },
    { quote: "Courage is the power to let go of the familiar.", source: "Goddess Durga (Durga Saptashati)" },
    { quote: "The self is the friend of the self.", source: "Lord Krishna (Bhagavad Gita)" },
    { quote: "Practice contentment, for it is the greatest wealth.", source: "Lord Vishnu (Vishnu Purana)" }
];

export function getQuoteOfTheDay() {
    const date = new Date();
    const dayOfMonth = date.getDate();
    const index = (dayOfMonth - 1) % hinduQuotes.length;
    return hinduQuotes[index];
}

