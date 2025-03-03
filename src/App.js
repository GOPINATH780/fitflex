import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';
import homeBackground from './assets/home.jpg';

// Function to get Lottie animation based on muscle group or equipment
const useLottieAnimation = (name) => {
  const [animationData, setAnimationData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    const fetchAnimation = async () => {
      const animationMappings = {
        'chest': 'https://assets5.lottiefiles.com/packages/lf20_x1gjdldd.json',
        'dumbbells': 'https://assets5.lottiefiles.com/packages/lf20_ck6mwxc8.json',
        'body weight': 'https://assets5.lottiefiles.com/packages/lf20_qm8eqkqm.json',
        'default': 'https://assets5.lottiefiles.com/packages/lf20_tqsxjo2e.json'
      };

      try {
        const searchKey = (name || '').toLowerCase();
        const key = searchKey.split(' ')[0];
        const url = animationMappings[searchKey] || animationMappings[key] || animationMappings.default;
        
        const response = await fetch(url);
        const data = await response.json();
        if (isMounted) {
          setAnimationData(data);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading animation:', error);
        try {
          const response = await fetch(animationMappings.default);
          const data = await response.json();
          if (isMounted) {
            setAnimationData(data);
            setLoading(false);
          }
        } catch (err) {
          console.error('Error loading default animation:', err);
          if (isMounted) {
            setLoading(false);
          }
        }
      }
    };

    fetchAnimation();
    return () => {
      isMounted = false;
    };
  }, [name]);

  return { animationData, loading };
};

// Function to get static image based on muscle group or equipment
const getExerciseImage = (name) => {
  const imageMappings = {
    'chest': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500',
    'back': 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=500',
    'shoulders': 'https://images.unsplash.com/photo-1598971639058-b1dc33468340?w=500',
    'biceps': 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=500',
    'triceps': 'https://images.unsplash.com/photo-1590507621108-433608c97823?w=500',
    'legs': 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=500',
    'abs': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500',
    'dumbbells': 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?w=500',
    'barbell': 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=500',
    'kettlebell': 'https://images.unsplash.com/photo-1603555591682-66cfb0c44c61?w=500',
    'machine': 'https://images.unsplash.com/photo-1576678927484-cc907957088c?w=500',
    'default': 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=500'
  };

  const searchKey = (name || '').toLowerCase();
  const key = searchKey.split(' ')[0];
  return imageMappings[searchKey] || imageMappings[key] || imageMappings.default;
};

// Category Card Component for Search Page
const CategoryCard = React.memo(({ item, isSelected, onClick }) => {
  if (!item) return null;

  return (
    <div
      onClick={onClick}
      className={`bg-gray-800/50 hover:bg-gray-700/50 rounded-lg overflow-hidden
        cursor-pointer transition-all duration-200 transform hover:scale-105 aspect-[3/5]
        ${isSelected ? 'ring-2 ring-teal-500' : ''}`}
    >
      <div className="relative h-full w-full">
        <img 
          src={getExerciseImage(item.name)}
          alt={item.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h3 className="text-white text-lg font-semibold text-center px-4">
            {item.name}
          </h3>
        </div>
      </div>
    </div>
  );
});

// Exercise Animation Component for Exercise List
const ExerciseAnimation = React.memo(({ exercise }) => {
  const { animationData, loading } = useLottieAnimation(exercise?.muscle || exercise?.equipment);
  
  if (!exercise) return null;

  return (
    <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden bg-gray-900/50">
      {!loading && animationData && (
        <Lottie
          animationData={animationData}
          loop={true}
          className="w-full h-full"
        />
      )}
      {loading && (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
        </div>
      )}
    </div>
  );
});

// Exercise Card Component for Exercise List
const ExerciseCard = React.memo(({ exercise, showAnimation = false }) => {
  if (!exercise) return null;

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 
      transition-all duration-200 aspect-[3/5]">
      {showAnimation ? (
        <ExerciseAnimation exercise={exercise} />
      ) : (
        <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
          <img 
            src={exercise.gifUrl}
            alt={exercise.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <h3 className="text-xl font-bold text-teal-300 mb-2">
        {exercise.name}
      </h3>
      <div className="text-gray-300 space-y-2 text-sm">
        <p><span className="font-semibold">Target:</span> {exercise.target}</p>
        <p><span className="font-semibold">Equipment:</span> {exercise.equipment}</p>
        <p><span className="font-semibold">Body Part:</span> {exercise.bodyPart}</p>
      </div>
    </div>
  );
});

// Exercise Card Component
const ExerciseCardComponent = React.memo(({ exercise }) => {
  const { animationData, loading } = useLottieAnimation(exercise?.muscle || exercise?.equipment);
  
  if (!exercise) return null;

  return (
    <div className="bg-gray-800/50 p-4 rounded-lg hover:bg-gray-700/50 
      transition-all duration-200 aspect-[3/5]">
      <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden bg-gray-900/50">
        {!loading && animationData && (
          <Lottie
            animationData={animationData}
            loop={true}
            className="w-full h-full"
          />
        )}
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500" />
          </div>
        )}
      </div>
      <h3 className="text-xl font-bold text-teal-300 mb-2">
        {exercise.name}
      </h3>
      <div className="text-gray-300 space-y-2 text-sm">
        <p><span className="font-semibold">Type:</span> {exercise.type}</p>
        <p><span className="font-semibold">Equipment:</span> {exercise.equipment}</p>
        <p><span className="font-semibold">Difficulty:</span> {exercise.difficulty}</p>
        <p className="text-xs line-clamp-4">{exercise.instructions}</p>
      </div>
    </div>
  );
});

const Home = () => (
  <div className="relative h-screen">
    <div 
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `url(${require('./assets/home.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    />
    <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black/50 text-white p-4 sm:p-8 text-center">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
        Welcome to FitLife – Your Personal Fitness Companion!
      </h1>
      <p className="text-lg sm:text-xl max-w-3xl mb-2 sm:mb-4">
        Transform Your Fitness Journey Today
      </p>
      <p className="text-base sm:text-lg max-w-2xl mb-6 sm:mb-8">
        Get personalized workout plans, expert fitness advice, and easy-to-follow exercises designed for all fitness levels.
      </p>
      <button 
        className="bg-teal-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-semibold 
          hover:bg-teal-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
      >
        Start Now
      </button>
    </div>
  </div>
);

const About = () => (
  <div className="min-h-screen relative flex-1">
    {/* Background Image */}
    <div 
      className="absolute inset-0"
      style={{
        backgroundImage: `url(${require('./assets/about.jpg')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'brightness(0.8)'
      }}
    />
    {/* Content */}
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 sm:p-8">
      <div className="max-w-3xl text-center text-white mt-16 bg-black/30 p-8 rounded-xl backdrop-blur-sm">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-teal-300 drop-shadow-lg">
          About FitLife
        </h1>
        <p className="text-lg sm:text-xl leading-relaxed mb-8 drop-shadow">
          FitLife is your ultimate fitness companion, designed to help you achieve your health goals with ease. 
          Explore a vast collection of exercises categorized by body parts and equipment, get expert workout guidance, 
          and track your favorites effortlessly.
        </p>
        <p className="text-lg sm:text-xl leading-relaxed drop-shadow">
          Whether you're a beginner or an athlete, our app ensures a seamless, engaging, and effective fitness journey. 
          Stay fit, stay strong! 💪🔥
        </p>
      </div>
    </div>
  </div>
);

const Search = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('bodyParts');
  const [bodyParts, setBodyParts] = React.useState([]);
  const [equipment, setEquipment] = React.useState([]);
  const [exercises, setExercises] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [selectedCategory, setSelectedCategory] = React.useState(null);

  // API Ninjas key
  const API_KEY = 'NQBvlaqTDZNLg2WYGwxV5g==cY4tBGUWZtL15fP8';

  const bodyPartsList = [
    { id: 1, name: 'Chest' },
    { id: 2, name: 'Upper Back' },
    { id: 3, name: 'Lower Back' },
    { id: 4, name: 'Shoulders' },
    { id: 5, name: 'Biceps' },
    { id: 6, name: 'Triceps' },
    { id: 7, name: 'Forearms' },
    { id: 8, name: 'Quadriceps' },
    { id: 9, name: 'Hamstrings' },
    { id: 10, name: 'Calves' },
    { id: 11, name: 'Abdominals' },
    { id: 12, name: 'Obliques' },
    { id: 13, name: 'Traps' },
    { id: 14, name: 'Lats' },
    { id: 15, name: 'Glutes' },
    { id: 16, name: 'Hip Flexors' },
    { id: 17, name: 'Lower Chest' },
    { id: 18, name: 'Upper Chest' },
    { id: 19, name: 'Middle Back' },
    { id: 20, name: 'Neck' }
  ];

  const equipmentList = [
    { id: 1, name: 'Dumbbells' },
    { id: 2, name: 'Barbell' },
    { id: 3, name: 'Kettlebell' },
    { id: 4, name: 'Resistance Bands' },
    { id: 5, name: 'Body Weight' },
    { id: 6, name: 'Cable Machine' },
    { id: 7, name: 'Smith Machine' },
    { id: 8, name: 'Medicine Ball' },
    { id: 9, name: 'Pull-up Bar' },
    { id: 10, name: 'Bench Press' },
    { id: 11, name: 'Squat Rack' },
    { id: 12, name: 'Leg Press' },
    { id: 13, name: 'Foam Roller' },
    { id: 14, name: 'Exercise Ball' },
    { id: 15, name: 'TRX' },
    { id: 16, name: 'Power Rack' },
    { id: 17, name: 'Battle Ropes' },
    { id: 18, name: 'Bosu Ball' },
    { id: 19, name: 'Weight Plates' },
    { id: 20, name: 'Rowing Machine' },
    { id: 21, name: 'Elliptical' },
    { id: 22, name: 'Treadmill' },
    { id: 23, name: 'Stationary Bike' },
    { id: 24, name: 'Yoga Mat' }
  ];

  React.useEffect(() => {
    if (activeTab === 'bodyParts') {
      fetchBodyParts();
    } else if (activeTab === 'equipment') {
      fetchEquipment();
    }
  }, [activeTab]);

  const fetchBodyParts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://wger.de/api/v2/muscle/');
      const data = await response.json();
      setBodyParts(data.results);
    } catch (err) {
      setError('Failed to fetch body parts. Please try again later.');
      console.error('Error fetching body parts:', err);
    }
    setLoading(false);
  };

  const fetchEquipment = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://wger.de/api/v2/equipment/');
      const data = await response.json();
      setEquipment(data.results);
    } catch (err) {
      setError('Failed to fetch equipment. Please try again later.');
      console.error('Error fetching equipment:', err);
    }
    setLoading(false);
  };

  const handleItemClick = (item, type) => {
    navigate(`/exercises/${type}/${item.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen relative flex-1">
      {/* Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${require('./assets/home.jpg')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.8)'
        }}
      />
      {/* Content */}
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-7xl mt-16 flex flex-col h-[calc(100vh-8rem)]">
          {/* Toggle Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('bodyParts')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'bodyParts'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Body Parts
            </button>
            <button
              onClick={() => setActiveTab('equipment')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                activeTab === 'equipment'
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Equipment
            </button>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-4 auto-rows-fr gap-4 pb-4">
              {(activeTab === 'bodyParts' ? bodyPartsList : equipmentList).map((item) => (
                <CategoryCard
                  key={item.id}
                  item={item}
                  isSelected={selectedCategory === item.name}
                  onClick={() => handleItemClick(item.name, activeTab)}
                />
              ))}
            </div>

            {/* Exercise Results */}
            {loading ? (
              <div className="mt-8 text-center">
                <div className="inline-block text-teal-500">
                  <svg className="animate-spin h-8 w-8" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
                <p className="text-white mt-2">Loading exercises...</p>
              </div>
            ) : error ? (
              <div className="mt-8 text-red-400 text-center py-8 bg-red-900/20 rounded-lg">
                <p>{error}</p>
              </div>
            ) : exercises.length > 0 ? (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-teal-300">
                    {selectedCategory} Exercises ({exercises.length})
                  </h2>
                </div>
                <div className="grid grid-cols-4 gap-4 pb-4">
                  {exercises.map((exercise, index) => (
                    <ExerciseCard key={index} exercise={exercise} showAnimation={false} />
                  ))}
                </div>
              </div>
            ) : selectedCategory ? (
              <div className="mt-8 text-white text-center py-8 bg-gray-800/30 rounded-lg">
                <p>No exercises found for {selectedCategory}. Try selecting a different category.</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExerciseList = () => {
  const [exercises, setExercises] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [filterType, setFilterType] = React.useState('all');
  const location = window.location.pathname;
  const [, , type, category] = location.split('/');
  const navigate = useNavigate();
  const RAPID_API_KEY = '2c31f315ffmsh16f254ae8014fdep1f1';

  React.useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const queryType = type === 'bodyParts' ? 'bodyPart' : 'equipment';
      const response = await fetch(
        `https://exercisedb.p.rapidapi.com/exercises/${queryType}/${category}`,
        {
          headers: {
            'X-RapidAPI-Key': RAPID_API_KEY,
            'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setExercises(data);
    } catch (err) {
      setError('Failed to fetch exercises. Please try again later.');
      console.error('Error fetching exercises:', err);
    }
    setLoading(false);
  };

  const filteredExercises = React.useMemo(() => {
    if (filterType === 'all') return exercises;
    
    return exercises.filter(exercise => {
      if (filterType === 'bodyweight') {
        return exercise.equipment.toLowerCase() === 'body weight' || exercise.equipment.toLowerCase() === 'none';
      } else if (filterType === 'equipment') {
        return exercise.equipment.toLowerCase() !== 'body weight' && exercise.equipment.toLowerCase() !== 'none';
      }
      return true;
    });
  }, [exercises, filterType]);

  const handleExerciseClick = (exerciseId) => {
    navigate(`/exercise/${exerciseId}`);
  };

  return (
    <div className="min-h-screen relative flex-1">
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${require('./assets/home.jpg')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(0.8)'
        }}
      />
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-7xl mt-16 flex flex-col h-[calc(100vh-8rem)]">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-teal-300 capitalize">
              {category.split('_').join(' ')} Exercises
            </h1>
            <div className="flex items-center gap-4">
              {category.toLowerCase() === 'chest' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      filterType === 'all'
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterType('bodyweight')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      filterType === 'bodyweight'
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    No Equipment
                  </button>
                  <button
                    onClick={() => setFilterType('equipment')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      filterType === 'equipment'
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    With Equipment
                  </button>
                </div>
              )}
              <Link
                to="/search"
                className="bg-gray-700 text-gray-300 hover:bg-gray-600 px-4 py-2 rounded-lg
                  transition-all duration-200"
              >
                Back to Search
              </Link>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500"></div>
              </div>
            ) : error ? (
              <div className="text-red-400 text-center py-8 bg-red-900/20 rounded-lg">
                {error}
              </div>
            ) : filteredExercises.length > 0 ? (
              <div className="grid grid-cols-4 gap-4 pb-4">
                {filteredExercises.map((exercise, index) => (
                  <div 
                    key={index}
                    onClick={() => handleExerciseClick(exercise.id)}
                    className="cursor-pointer"
                  >
                    <ExerciseCard exercise={exercise} showAnimation={true} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white text-center py-8 bg-gray-800/30 rounded-lg">
                No exercises found for this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ExerciseDetail = () => {
  const [exercise, setExercise] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const location = useLocation();
  const exerciseId = location.pathname.split('/').pop();
  const RAPID_API_KEY = '2c31f315ffmsh16f254ae8014fdep1f1';

  React.useEffect(() => {
    const fetchExerciseDetail = async () => {
      try {
        const response = await fetch(
          `https://exercisedb.p.rapidapi.com/exercises/exercise/${exerciseId}`,
          {
            headers: {
              'X-RapidAPI-Key': RAPID_API_KEY,
              'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
            }
          }
        );
        const data = await response.json();
        setExercise(data);
      } catch (error) {
        console.error('Error fetching exercise:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExerciseDetail();
  }, [exerciseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Exercise not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-teal-300 mb-6">{exercise.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800/50 rounded-lg overflow-hidden">
            <img 
              src={exercise.gifUrl} 
              alt={exercise.name}
              className="w-full h-auto"
            />
          </div>
          
          <div className="space-y-4">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-teal-300 mb-2">Target Information</h2>
              <p><span className="font-semibold">Target Muscle:</span> {exercise.target}</p>
              <p><span className="font-semibold">Equipment:</span> {exercise.equipment}</p>
              <p><span className="font-semibold">Body Part:</span> {exercise.bodyPart}</p>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-teal-300 mb-2">Secondary Muscles</h2>
              <div className="flex flex-wrap gap-2">
                {exercise.secondaryMuscles?.map((muscle, index) => (
                  <span key={index} className="bg-teal-500/20 px-3 py-1 rounded-full text-sm">
                    {muscle}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-teal-300 mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2">
            {exercise.instructions?.map((instruction, index) => (
              <li key={index} className="text-gray-300">{instruction}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 bg-black/30 backdrop-blur-sm z-50">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <Link to="/" className="text-2xl font-bold text-teal-500">FitLife</Link>
        <div className="flex space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white px-3 py-2 transition-colors">Home</Link>
          <Link to="/about" className="text-gray-300 hover:text-white px-3 py-2 transition-colors">About</Link>
          <Link to="/search" className="text-gray-300 hover:text-white px-3 py-2 transition-colors">Search</Link>
        </div>
      </div>
    </div>
  </nav>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/exercises/:type/:category" element={<ExerciseList />} />
          <Route path="/exercise/:id" element={<ExerciseDetail />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
