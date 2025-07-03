import React from 'react';
import PageTitle from './components/PageTitle/PageTitle';
import AnimalForm from './components/AnimalForm/AnimalForm';
import MainCard from './components/MainCard/MainCard';
import Favorites from './components/Favorites/Favorites';
import jsonLocalStorage from './utils/jsonLocalStorage';


const OPEN_API_DOMAIN = 'https://cataas.com';



// Open API ////////////////////////////////////////////
const fetchCat = async (text) => {
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?width=400&height=400&json=true`);
  const responseJson = await response.json();

  return responseJson.url;
};


function App() {
  console.log('** App 실행 **');

  const [mainAnimal, setMainAnimal] = React.useState(`${OPEN_API_DOMAIN}/cat`);
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem('favorites') || [];
  });

  const [count, setCount] = React.useState(() => {
    return jsonLocalStorage.getItem('count') || 1;
  });

  const choiceFavorite = favorites.includes(mainAnimal);

  function incrementCount() {
    setCount((pre) => {
      const nextCount = pre + 1;
      localStorage.setItem('count', JSON.stringify(nextCount));
      return nextCount;
    });
  }

  async function updateMainAnimal(text) {
    const newCat = await fetchCat(text);
    setMainAnimal(newCat);

    incrementCount();
  }

  function handleHeartClick() {
    if (favorites.includes(mainAnimal)) {
      alert('이미 추가된 귀여운 고양이입니다. 😻')
      return;
    }

    setFavorites((pre) => {
      const nextFavorites = [...pre, mainAnimal];
      localStorage.setItem('favorites', JSON.stringify(nextFavorites));
      return nextFavorites;
    });

  }

  return (
    <div>
      <PageTitle>🌱🌱 {count} 페이지 🌱🌱</PageTitle>
      <AnimalForm updateMainAnimal={updateMainAnimal} />
      <MainCard
        src={mainAnimal}
        alt="아기 곰"
        handleHeartClick={handleHeartClick}
        choiceFavorite={choiceFavorite}
      />
      <Favorites favorites={favorites} />
    </div>
  );
}


export default App;
