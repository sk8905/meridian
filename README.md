<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tickr - News Aggregator</title>
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/lucide-react@latest/dist/umd/lucide-react.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;
        const { Search, Bookmark, BookmarkCheck, Clock, ExternalLink, Plus, Settings, X, Trash2 } = lucideReact;

        const TickrApp = () => {
            const [articles, setArticles] = useState([]);
            const [savedArticles, setSavedArticles] = useState([]);
            const [activeCategory, setActiveCategory] = useState('headlines');
            const [searchTerm, setSearchTerm] = useState('');
            const [currentView, setCurrentView] = useState('home');
            const [showAddFeed, setShowAddFeed] = useState(false);
            const [showSettings, setShowSettings] = useState(false);
            const [loading, setLoading] = useState(false);
            const [newFeedUrl, setNewFeedUrl] = useState('');
            const [newFeedCategory, setNewFeedCategory] = useState('headlines');

            // Default RSS feeds
            const [rssFeeds, setRssFeeds] = useState({
                headlines: [
                    { url: 'https://rss.cnn.com/rss/edition.rss', name: 'CNN' },
                    { url: 'https://feeds.bbci.co.uk/news/rss.xml', name: 'BBC News' },
                    { url: 'https://rss.reuters.com/reuters/topNews', name: 'Reuters' }
                ],
                markets: [
                    { url: 'https://feeds.bloomberg.com/markets/news.rss', name: 'Bloomberg Markets' },
                    { url: 'https://www.marketwatch.com/rss/marketwatch/realtimeheadlines', name: 'MarketWatch' }
                ],
                economy: [
                    { url: 'https://www.federalreserve.gov/feeds/press_all.xml', name: 'Federal Reserve' },
                    { url: 'https://feeds.bloomberg.com/economics/news.rss', name: 'Bloomberg Economics' }
                ],
                newsletters: [
                    { url: 'https://feeds.feedburner.com/venturebeat/SZYF', name: 'VentureBeat' },
                    { url: 'https://techcrunch.com/feed/', name: 'TechCrunch' }
                ]
            });

            const categories = ['headlines', 'markets', 'economy', 'newsletters'];

            // RSS Parser function using CORS proxy
            const parseRSSFeed = async (feedUrl) => {
                try {
                    // Using RSS2JSON service as CORS proxy
                    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feedUrl)}`;
                    const response = await fetch(proxyUrl);
                    const data = await response.json();
                    
                    if (data.status === 'ok') {
                        return data.items.map((item, index) => ({
                            id: `${feedUrl}-${index}`,
                            title: item.title,
                            summary: item.description ? item.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : 'No summary available',
                            source: data.feed.title || 'RSS Feed',
                            publishedAt: item.pubDate,
                            url: item.link
                        }));
                    }
                    return [];
                } catch (error) {
                    console.error('Error parsing RSS feed:', error);
                    return [];
                }
            };

            // Load articles from RSS feeds
            const loadArticles = async (category) => {
                setLoading(true);
                const feeds = rssFeeds[category] || [];
                let allArticles = [];

                try {
                    for (const feed of feeds) {
                        const feedArticles = await parseRSSFeed(feed.url);
                        allArticles = [...allArticles, ...feedArticles];
                    }

                    // Sort by publication date (newest first)
                    allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
                    setArticles(allArticles.slice(0, 20)); // Limit to 20 articles
                } catch (error) {
                    console.error('Error loading articles:', error);
                    setArticles([]);
                }
                setLoading(false);
            };

            useEffect(() => {
                loadArticles(activeCategory);
            }, [activeCategory, rssFeeds]);

            const addNewFeed = () => {
                if (newFeedUrl.trim()) {
                    const feedName = new URL(newFeedUrl).hostname;
                    setRssFeeds(prev => ({
                        ...prev,
                        [newFeedCategory]: [
                            ...prev[newFeedCategory],
                            { url: newFeedUrl.trim(), name: feedName }
                        ]
                    }));
                    setNewFeedUrl('');
                    setShowAddFeed(false);
                }
            };

            const removeFeed = (category, feedUrl) => {
                setRssFeeds(prev => ({
                    ...prev,
                    [category]: prev[category].filter(feed => feed.url !== feedUrl)
                }));
            };

            const toggleSaveArticle = (article) => {
                setSavedArticles(prev => {
                    const isAlreadySaved = prev.some(saved => saved.id === article.id);
                    if (isAlreadySaved) {
                        return prev.filter(saved => saved.id !== article.id);
                    } else {
                        return [...prev, article];
                    }
                });
            };

            const isArticleSaved = (articleId) => {
                return savedArticles.some(saved => saved.id === articleId);
            };

            const filteredArticles = articles.filter(article =>
                article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                article.summary.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const formatTime = (dateString) => {
                const date = new Date(dateString);
                const now = new Date();
                const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
                
                if (diffInHours < 1) return 'Just now';
                if (diffInHours < 24) return `${diffInHours}h ago`;
                return `${Math.floor(diffInHours / 24)}d ago`;
            };

            const ArticleCard = ({ article }) => (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">
                            {article.title}
                        </h3>
                        <button
                            onClick={() => toggleSaveArticle(article)}
                            className="flex-shrink-0 p-1"
                        >
                            {isArticleSaved(article.id) ? (
                                <BookmarkCheck className="w-5 h-5 text-blue-600" />
                            ) : (
                                <Bookmark className="w-5 h-5 text-gray-400" />
                            )}
                        </button>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                        {article.summary}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-4">
                            <span className="font-medium">{article.source}</span>
                            <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTime(article.publishedAt)}
                            </div>
                        </div>
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            );

            const AddFeedModal = () => (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Add RSS Feed</h2>
                            <button onClick={() => setShowAddFeed(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">RSS Feed URL</label>
                                <input
                                    type="url"
                                    value={newFeedUrl}
                                    onChange={(e) => setNewFeedUrl(e.target.value)}
                                    placeholder="https://example.com/feed.xml"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    value={newFeedCategory}
                                    onChange={(e) => setNewFeedCategory(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="capitalize">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <button
                                onClick={addNewFeed}
                                disabled={!newFeedUrl.trim()}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Feed
                            </button>
                        </div>
                    </div>
                </div>
            );

            const SettingsModal = () => (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm max-h-96 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Manage RSS Feeds</h2>
                            <button onClick={() => setShowSettings(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {categories.map(category => (
                            <div key={category} className="mb-4">
                                <h3 className="font-medium capitalize mb-2">{category}</h3>
                                <div className="space-y-2">
                                    {rssFeeds[category].map((feed, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                            <span className="text-sm truncate flex-1">{feed.name}</span>
                                            <button
                                                onClick={() => removeFeed(category, feed.url)}
                                                className="text-red-600 p-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );

            const renderHomeView = () => (
                <div>
                    <div className="flex space-x-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search news..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={() => setShowAddFeed(true)}
                            className="bg-blue-600 text-white p-2 rounded-lg"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setShowSettings(true)}
                            className="bg-gray-600 text-white p-2 rounded-lg"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex space-x-1 mb-4 bg-gray-100 rounded-lg p-1">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium capitalize transition-colors ${
                                    activeCategory === category
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-gray-500 mt-2">Loading articles...</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredArticles.length > 0 ? (
                                filteredArticles.map(article => (
                                    <ArticleCard key={article.id} article={article} />
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    {searchTerm ? 'No articles found for your search.' : 'No articles available. Try adding some RSS feeds!'}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );

            const renderSavedView = () => (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Articles</h2>
                    {savedArticles.length > 0 ? (
                        <div className="space-y-3">
                            {savedArticles.map(article => (
                                <ArticleCard key={article.id} article={article} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Bookmark className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No saved articles yet.</p>
                            <p className="text-sm">Tap the bookmark icon on articles to save them here.</p>
                        </div>
                    )}
                </div>
            );

            return (
                <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-16">
                    <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                        <div className="px-4 py-4">
                            <h1 className="text-xl font-bold text-gray-900">Tickr</h1>
                        </div>
                    </div>

                    <div className="p-4">
                        {currentView === 'home' ? renderHomeView() : renderSavedView()}
                    </div>

                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
                        <div className="max-w-md mx-auto flex">
                            <button
                                onClick={() => setCurrentView('home')}
                                className={`flex-1 py-4 text-center transition-colors ${
                                    currentView === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                                }`}
                            >
                                <div className="text-sm font-medium">Home</div>
                            </button>
                            <button
                                onClick={() => setCurrentView('saved')}
                                className={`flex-1 py-4 text-center transition-colors ${
                                    currentView === 'saved' ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
                                }`}
                            >
                                <div className="text-sm font-medium">
                                    Saved ({savedArticles.length})
                                </div>
                            </button>
                        </div>
                    </div>

                    {showAddFeed && <AddFeedModal />}
                    {showSettings && <SettingsModal />}
                </div>
            );
        };

        ReactDOM.render(<TickrApp />, document.getElementById('root'));
    </script>
</body>
</html>
