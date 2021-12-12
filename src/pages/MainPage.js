import React, { useState, useEffect } from 'react';
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Image } from 'primereact/image';
import CatstagramLogo from '../assets/imgs/catstagram.png';
const axios = require('axios');


function MainPage() {
  const [city, setCity] = useState('');
  // const [selectedBreed, setSelectedBreed] = useState('');
  const [data, setData] = useState(
  {
    country_flag_url:"",
    images: [],
    breeds:[],
    selected_breed: "",
    current_image: {},
  }
  );

  const [headerBreeds, setHeaderBreeds] = useState([]);
  const [imagettributes, setimagettributes] = useState({});

  useEffect(() => {
    (data.breeds.length <= 0) && getBreeds();
    (data.images.length == 0) && getImages('');
    data.breeds.length > 0  && sortImagesHeader();
  }, [data.breeds, headerBreeds]);
  
  const citySelectItems = [
    {label: 'New York', value: 'NY'},
    {label: 'Rome', value: 'RM'},
    {label: 'London', value: 'LDN'},
    {label: 'Istanbul', value: 'IST'},
    {label: 'Paris', value: 'PRS'}
];
  let getBreeds = async () => {
                try{
                    axios.defaults.headers.common['795b1114-38d1-45da-8f3c-019934eb60c7'] = "DEMO-API-KEY" // Replace this with your API Key, as it's set to defaults it will be used from now onwards
                    
                    let response = await axios.get('https://api.thecatapi.com/v1/breeds/' ) 
                    let allBreeds = response.data;
                    setData(prevState => ({
                      ...prevState, breeds:allBreeds
                  }),)

                }catch(err){
                    console.log(err)
                }
            }

    let fLog = (val) => {

    }         
            
  const getImages = async (idImg) => 
    {
        try{
          let strBreed = idImg;
          
            let query_params = {
                breed_ids: strBreed,
                limit:8
            }

            let response = await axios.get('https://api.thecatapi.com/v1/images/search', { params: query_params} ) 
 
            let selectedB = data.selected_breed;
            if(selectedB !== idImg || selectedB === ''){
            let imagesData = response.data;
                  setData(prevState => ({
                      ...prevState, images:imagesData, selected_breed:idImg
                  }))
                }
            
        }catch(err){
            console.log(err)
        }
    }

    const sortImagesHeader =  async (val) => {
      
        let nuberOfitemsToSet = 6;
        let lengthNumber = data.breeds.length;
        let arrBreedsHeader = [];

        for (let i = 0; i <= nuberOfitemsToSet; i++) {
          let numberRandom = randomNumber(0, lengthNumber);
            let imageRandom =  await getOneImage(data.breeds[numberRandom].id);
          
          if (imageRandom) {
            const elementObjet = {
            name: data.breeds[numberRandom].name,
            url: imageRandom,

          };

          if(headerBreeds.length < nuberOfitemsToSet){
            arrBreedsHeader.push(elementObjet);

          }

          if (arrBreedsHeader.length ==  nuberOfitemsToSet+1) {
            setHeaderBreeds(arrBreedsHeader);
          }
        }

          
        }
    }


    const getOneImage = async (idImg) => 
    {
        try{
          let strBreed = idImg;
            let query_params = {
                breed_ids: strBreed,
                limit:1
            }

            let response = await axios.get('https://api.thecatapi.com/v1/images/search', { params: query_params} ) 

            let images = response.data;
            
            let justOneImageBreed = response.data[0].url;
            return justOneImageBreed;
            
        }catch(err){
            console.log(err)
        }
    }

    const randomNumber = (minimo,maximo) =>{
      return Math.floor(Math.random() * ((maximo+1)-minimo)+minimo);
    }

    let imageClick = (image) => {
      console.log(image);

      let name= (image.breeds.length !==0) ? (image.breeds[0].name) : 'nombre en otro petición';
      let url = (image.url) ? image.url : 'nombre en otro petición';
      let desccription = (image.breeds.length !==0) ? image.breeds[0].description : 'nombre en otro petición';

      console.log(
        'image:'+ name
      );
      console.log('url:' + url);
      console.log('description:' + desccription);
    }


  return (
    <div>
        <Menubar
          start={<Image src={CatstagramLogo} alt="catstagram" width='100'/>}
          end={
            <Dropdown optionLabel="name" optionValue="id" value={data.selected_breed} options={data.breeds} onChange={(e) => {setData((prevState) => ({ ...prevState, selected_breed:e.value})); getImages(e.value); fLog(e.value);}} placeholder="Select a Breed"/>
            }
        />
      <div>
        <div className="p-grid">
          {headerBreeds.map((breed, index) => (
            <div key={index} className="p-col-1">
              <Image src={breed.url} alt="catstagram" width='100'/>
              <p>{breed.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-grid">
      {data.images.map((image, index) => (
         <div key={index} className="p-col-4"><a onClick={() => imageClick(image)}><Image src={image.url} alt="catstagram" width='100' /></a></div>
      ))}
      </div>

      
    </div>
  );
}
export default MainPage;
