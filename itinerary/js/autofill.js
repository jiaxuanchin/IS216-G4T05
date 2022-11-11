//map with auto-fill to get long lang and place ID (Google API)
function fill_origin(){
  let origin_list = document.getElementsByClassName('origin_fill')
  for(origin of origin_list){
    const origin_auto = new google.maps.places.Autocomplete(origin, {
        fields: ["place_id", "geometry", "name", "formatted_address"],
      });
    //this line below execute after choosing the autofill option
    origin_auto.addListener("place_changed", () => {
        const place = origin_auto.getPlace();
        if (!place.place_id) {
          return;
        }
        //stored value in hidden input field
        let to_add = document.getElementById('origin_lat')
        to_add.value =place.geometry.location.lat()
        to_add = document.getElementById('origin_lng')
        to_add.value = place.geometry.location.lng()
        document.getElementById('place_id').value = place.place_id
        //fill on place_info
        track = 0
        for(original of origin_list){
            if(original.value.includes(place.name)){
              document.getElementById('recommended_track').value=track
              fill_info(track)
              fill_rec(track)
            }
            track+=1
        }
        


        let auto_complete_list = document.getElementsByClassName('origin_fill')
        for(item of auto_complete_list){
          item.value = ''
        }
      })
   
  }

}

function fill_template(){
  document.getElementById('accordionFlushExample').innerHTML = ''
  let text = document.getElementById('result-3').innerHTML
  date_list = text.split(',')
  for(let i=0; i<date_list.length; i++){
    skip_index = 0
    for(let u=0;u<3;u++){
      skip_index = date_list[i].indexOf(' ',skip_index)
      skip_index += 1
    }
    date_text = date_list[i].slice(0,skip_index)
    item = document.createElement('div')
    item.innerHTML = `
    <div class="accordion-item">
            <!-- header -->
            <h2 class="accordion-header" id="flush-headingOne">
              <button class="accordion-button collapsed " type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                <h4 id="${i}">${date_text} </h4>
          
              </button>
            </h2>

            <!-- body -->
            <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                <div class="accordion-body "> 
                    <div class="row d-flex">
                        <div class="col-12">
                          <!------------- SEARCH BOX ------------->

                          <!--PLACE INFO START-->
                           <div class="place_info"></div>

                          <!--ADD PLACE INPUT BOX-->
                          <div class="search-box mb-2 ">
                            <input type="text" id="${i}" class="form-control origin_fill" placeholder="Add a place">
                            <br>
                            
                            <div class="row recommend_header"></div>
                            <div class="recommended" ></div>

                          </div>
                          <br>                       
                        </div> <!--end col-->
                    </div> <!--end row-->
                </div> <!--end accordion body-->
            </div> <!--end accordion collaspe-->
          </div> <!--end DAY 1--></div>
    `
    document.getElementById('accordionFlushExample').appendChild(item)
    fill_origin();
   
  }

  
}


//get distance by driving (Google API)
function getDistance_Drive(item){
//get value from hidden input field
let distance_list = document.getElementsByClassName('get_distance') // list for all days
distance_list = item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('get_distance') //list for only one day
for(places in distance_list){
  if(distance_list[places].innerHTML != undefined){
    id=distance_list[places].innerHTML.split(',')[0]
  if(id==item.value){
    id_save = id
    origin_lat = distance_list[places].innerHTML.split(',')[1]
    origin_lng = distance_list[places].innerHTML.split(',')[2]
    if((Number(places)+1) <= distance_list.length-1){
      destination_lat = distance_list[Number(places)+1].innerHTML.split(',')[1]
      destination_lng = distance_list[Number(places)+1].innerHTML.split(',')[2]
    }
    else{
      console.log('out of bound')
    }
  }
  }
}
if(origin_lat != 'None' && destination_lat != 'None'){
    // Add Distance Matrix here
const service = new google.maps.DistanceMatrixService(); // instantiate Distance Matrix service
const matrixOptions = {
origins: [{ lat: Number(origin_lat), lng: Number(origin_lng) }], // technician locations
destinations: [{ lat: Number(destination_lat), lng: Number(destination_lng) }], // customer address
travelMode: 'DRIVING',
unitSystem: google.maps.UnitSystem.IMPERIAL
};
// Call Distance Matrix service
service.getDistanceMatrix(matrixOptions, callback);

// Callback function used to process Distance Matrix response
function callback(response, status) {
if (status !== "OK") {
    alert("Error with distance matrix");
    return;
}
let distance = response.rows[0].elements[0].distance.text //get distance
let duration = response.rows[0].elements[0].duration.text //get duration
let to_add = document.getElementsByClassName('distance')
for(item of to_add){
  console.log(item)
  if(item.id == id_save){
    item.innerHTML = 'distance = '+distance + ' duration = '+duration
  }
}
}
}

}

function getDistance_walk(item){
//get value from hidden input field
let distance_list = document.getElementsByClassName('get_distance') // list for all days
distance_list = item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('get_distance') //list for only one day
for(places in distance_list){
console.log(distance_list[places])
if(distance_list[places].innerHTML != undefined){
  id=distance_list[places].innerHTML.split(',')[0]
if(id==item.value){
  id_save = id
  origin_lat = distance_list[places].innerHTML.split(',')[1]
  origin_lng = distance_list[places].innerHTML.split(',')[2]
  if((Number(places)+1) <= distance_list.length-1){
 
    destination_lat = distance_list[Number(places)+1].innerHTML.split(',')[1]
    destination_lng = distance_list[Number(places)+1].innerHTML.split(',')[2]

  }
  else{
    console.log('out of bound')
  }
}
}
}
if(origin_lat != 'None' && destination_lat != 'None'){
  // Add Distance Matrix here
const service = new google.maps.DistanceMatrixService(); // instantiate Distance Matrix service
const matrixOptions = {
origins: [{ lat: Number(origin_lat), lng: Number(origin_lng) }], // technician locations
destinations: [{ lat: Number(destination_lat), lng: Number(destination_lng) }], // customer address
travelMode: 'WALKING',
unitSystem: google.maps.UnitSystem.IMPERIAL
};
// Call Distance Matrix service
service.getDistanceMatrix(matrixOptions, callback);

// Callback function used to process Distance Matrix response
function callback(response, status) {
if (status !== "OK") {
  alert("Error with distance matrix");
  return;
}
let distance = response.rows[0].elements[0].distance.text //get distance
let duration = response.rows[0].elements[0].duration.text //get duration
let to_add = document.getElementsByClassName('distance')
for(item of to_add){
console.log(item)
if(item.id == id_save){
  item.innerHTML = 'distance = '+distance + ' duration = '+duration
}
}
}
}

}

function getDistance_transit(item){
//get value from hidden input field
let distance_list = document.getElementsByClassName('get_distance') // list for all days
distance_list = item.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('get_distance') //list for only one day
for(places in distance_list){
console.log(distance_list[places])
if(distance_list[places].innerHTML != undefined){
  id=distance_list[places].innerHTML.split(',')[0]
if(id==item.value){
  id_save = id
  origin_lat = distance_list[places].innerHTML.split(',')[1]
  origin_lng = distance_list[places].innerHTML.split(',')[2]
  if((Number(places)+1) <= distance_list.length-1){
 
    destination_lat = distance_list[Number(places)+1].innerHTML.split(',')[1]
    destination_lng = distance_list[Number(places)+1].innerHTML.split(',')[2]

  }
  else{
    console.log('out of bound')
  }
}
}
}
if(origin_lat != 'None' && destination_lat != 'None'){
  // Add Distance Matrix here
const service = new google.maps.DistanceMatrixService(); // instantiate Distance Matrix service
const matrixOptions = {
origins: [{ lat: Number(origin_lat), lng: Number(origin_lng) }], // technician locations
destinations: [{ lat: Number(destination_lat), lng: Number(destination_lng) }], // customer address
travelMode: 'TRANSIT',
unitSystem: google.maps.UnitSystem.IMPERIAL
};
// Call Distance Matrix service
service.getDistanceMatrix(matrixOptions, callback);

// Callback function used to process Distance Matrix response
function callback(response, status) {
if (status !== "OK") {
  alert("Error with distance matrix");
  return;
}
let distance = response.rows[0].elements[0].distance.text //get distance
let duration = response.rows[0].elements[0].duration.text //get duration
let to_add = document.getElementsByClassName('distance')
for(item of to_add){
console.log(item)
if(item.id == id_save){
  item.innerHTML = 'distance = '+distance + ' duration = '+duration
}
}
}
}

}

function fill_info(track){
if(document.getElementsByClassName('recommend_header')[track].innerHTML==''){
document.getElementsByClassName('recommend_header')[track].innerHTML = `
<div class="col-8">Recommended places</div>
                          <div class="col-4">
                            <select name="category" class="category">
                              <option value="restaurant">restaurant</option>
                              <option value="bar">bar</option>
                              <option value="museum">museum</option>
                              <option value="amusement_park">amusement park</option>
                              <option value="book_store">book_store</option>
                              <option value="shopping_mall">shopping mall</option>
                              <option value="night_club">night club</option>
                              <option value="movie_theater">movie theater</option>
                            </select>
                          </div>
`
let category = document.getElementsByClassName('category')[track]
category.addEventListener('change',fill_rec)
}

let id = document.getElementById('place_id').value
let lati = document.getElementById('origin_lat').value 
let lng = document.getElementById('origin_lng').value 
const map = new google.maps.Map(document.getElementById("map"), {
center: { lat: Number(lati), lng: Number(lng) },
zoom: 13,
})
let location = new google.maps.LatLng(lati,lng)

//fill place_info
var request = {
placeId: id,
fields: ['name', 'rating', 'photo']
};

service = new google.maps.places.PlacesService(map);
service.getDetails(request, callback);

function callback(place, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    if(place.photos[0] != undefined){
      picture_url = place.photos[0].getUrl({
   })
   }
   let name = place.name
   console.log(id)
   let fill = document.createElement('div');
   id_rep = id.replace('-','_')
   for(let i=0;i<10;i++){
    id_rep = id_rep.replace('-','_')
   }
   fill.id = id_rep + 'row'
   fill.className = "container";
   fill.innerHTML = `
    <div class="row my-2">
      <div class="col mb-2 rounded p-3 bg-light" >
        <h3>${name}
         <span style='float:right' class='fa fa-trash ' onClick="removePlace(${id_rep+'row'})"></span>
        </h3>
      <div>
    </div>
   <div class="row">
  
    <div class="col-4">
      <img src=${picture_url} alt="" style="width: 150px; height: 150px;">
      <br>
      <div hidden class='get_distance'>${id},${lati},${lng}</div>
      <p>
      <button value=${id} onclick='getDistance_Drive(this)' class="btn" id="button_drive"><i class="fa fa-car"></i>car</button>
      <button value=${id} onclick='getDistance_transit(this)' class="btn " id ='Transit'><i class="fa fa-subway"></i>public transport</button>
      <button value=${id} onclick='getDistance_walk(this)' class="btn" id="walking"><i class="fas fa-walking"></i>walking</button>
    
      <div class="distance" id=${id}></div>
      </p>
    </div>
    
    <div class="col-8"> 
      <div class="row">
  
        <!------------- NOTE ------------------>
        <div class="col-6">
          <button class="btn btn-new-grey mb-3" href="#" onClick="addFormField(${id_rep+'notes1'}); return false;">+Note &nbsp;<i class="fa fa-sticky-note"></i></button>
          <br>
          <form action="#" method="get" id="form1">
            <input type="hidden" id=${id_rep+'notes1'}>
            <div class="divTxt" id=${id_rep+'notes2'}></div>
          </form>
        </div>
  
        <!-------------CHECKLIST -------------->
        <div class="col-6">
          <button class="btn btn-new-grey  mb-3" href="#" onClick="addCheckbox(${id_rep+'check1'}); return false;">+Checklist &nbsp;<i class="fa fa-check-square"></i></button>
          <br>
          <form action="#" method="get" id="form2">
          <input type="hidden" id=${id_rep+'check1'}>
          <div class="divCheckBox" id=${id_rep+'check2'}></div>
          </form>
        </div>
        <div hidden class='getAllVal'>${id},${id_rep+'row'},${name},${lati},${lng},${picture_url},${track}</div>
      </div>
    </div>
    </div>
  </div>
   `
   let parent = document.getElementsByClassName('place_info')[track]
   parent.appendChild(fill)
  }
  }
  }

function removePlace(id){
console.log('hello')
console.log(id)
document.getElementById(id.id).remove()
}

function fill_rec(){
let num = document.getElementById('recommended_track').value
let parent = document.getElementsByClassName('recommended')[num]
let id = document.getElementById('place_id').value
let lati = document.getElementById('origin_lat').value 
let lng = document.getElementById('origin_lng').value 
let category = document.getElementsByClassName('category')[num].value
const map = new google.maps.Map(document.getElementById("map"), {
center: { lat: Number(lati), lng: Number(lng) },
zoom: 13,
})
let location = new google.maps.LatLng(lati,lng)

//fill place_info
var request = {
placeId: id,
fields: ['name', 'rating', 'photo']
};

service = new google.maps.places.PlacesService(map)
var request = {
location: location,
radius: '500',
type: [category]
};

service = new google.maps.places.PlacesService(map);
service.textSearch(request, callback);



function callback(results, status) {
if (status == google.maps.places.PlacesServiceStatus.OK) {
let num = document.getElementById('recommended_track').value
let name = ''
let photo = ''
let fill = ""
fill.innerHTML = ''
let first = true
var indx = 0
var active_status = "active"
let carouselnum = document.getElementById('carousel_num').innerHTML
let id = 'carouselExampleControls'+ carouselnum
let id2 = '#carouselExampleControls'+carouselnum
fill += `
  <div>
    <div id=${id} class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
  `

for(item of results){
  place_id = item.place_id
  name = item.name
  if(item.photos != undefined){
    photo = item.photos[0].getUrl({})
  }
  
  if(indx !== 0){
    active_status = ""
  }

  if(first){
    indx ++
    first = false
    fill += `
    <div class="carousel-item ${active_status}" >
      <div class ="d-flex">
        <div class="col-6">

          <!--This is the start of the card-->
          <div class="card mb-3" >
            <div class="row g-0" >

              <div class="col-6">
              <img alt="Card image cap" class="card" style='width:150px; height: 150px' src="${photo}" />
              </div>

              <div class="col-6">
                <div class="card-body" >
                    <p class="card-title">
                      ${name}
                    </p>
                    <button value=${place_id} onclick='add_rec(this,${num})' class="btn btn-primary  btn-sm" type="submit" class="add_recommend">ADD!</button>
                </div>
              </div>

            </div>
          </div>
          <!--This is the end of the card-->
        </div>
`
  }
  else{
    fill += `
      <div class= "col-6">
        <!--Start of second card-->
        <div class="card mb-3" >
          <div class="row g-0" >

            <div class="col-6">
              <img alt="Card image cap" class="card" style='width:150px; height: 150px' src="${photo}" />
            </div>
            
            <div class="col-6">
              <div class="card-body" >
                    <p class="card-title">${name}</p>
                    <button value=${place_id} onclick='add_rec(this,${num},${id})' class="btn btn-primary  btn-sm" style="position:absolute; type="submit" class="add_recommend">ADD!</button>
              </div>
            </div>

          </div>
        </div>
      <!--End of card-->
      
      </div>
      <!--closing the col-6-->
    </div>
  </div>`
  first = true
  }

}
fill +=  `
        </div>
          <button class="carousel-control-prev" type="button" data-bs-target=${id2} data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target=${id2} data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
          </div>
        </div>`
parent.innerHTML = fill
document.getElementById('carousel_num').innerHTML = Number(document.getElementById('carousel_num').innerHTML) + 1
}
}
}



function add_rec(place_id,track){
  if(place_id.value == undefined){
    console.log('fail to retrieve API')
    return 
  }
let id = document.getElementById('place_id').value
let lati = document.getElementById('origin_lat').value 
let lng = document.getElementById('origin_lng').value 
const map = new google.maps.Map(document.getElementById("map"), {
center: { lat: Number(lati), lng: Number(lng) },
zoom: 13,
})
let location = new google.maps.LatLng(lati,lng)

//fill place_info
var request = {
placeId: place_id.value,
fields: ['name', 'rating', 'photo','place_id','geometry']
};

service = new google.maps.places.PlacesService(map);
service.getDetails(request, callback);

function callback(place, status) {
  lati = place.geometry.location.lat()
  lng = place.geometry.location.lng()
  id = place.place_id
  console.log(id)
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    if(place.photos[0] != undefined){
      picture_url = place.photos[0].getUrl({
   })
   }
   id_rep = id.replace('-','_')
   for(let i=0;i<10;i++){
    id_rep = id_rep.replace('-','_')
   }
   console.log(id_rep)
   let name = place.name
   let fill = document.createElement('div');
   fill.id = id_rep + 'row'
   fill.className = "container";
   fill.innerHTML = `
   <div class="row my-2" id=''>
     <div class="col mb-2 rounded p-3 bg-light" >
       <h3>
          ${name}
           <span style='float:right' class='fa fa-trash ' onClick="removePlace(${id_rep+'row'})"></span>
       </h3>
     <div>
     
   </div>
  
  <div class="row" > 
   <div class="col-4">
     <img src=${picture_url} alt="" style="width: 150px; height: 150px;">
     <br>
     <div hidden class='get_distance'>${id},${lati},${lng}</div>
     <p>
     <button value=${id} onclick='getDistance_Drive(this)' class="btn" id="button_drive"><i class="fa fa-car"></i>car</button>
     <button value=${id} onclick='getDistance_transit(this)' class="btn " id ='Transit'><i class="fa fa-subway"></i>public transport</button>
     <button value=${id} onclick='getDistance_walk(this)' class="btn" id="walking"><i class="fas fa-walking"></i>walking</button>
   
     <div class="distance" id=${id}></div>
     </p>
   </div>
  
   <div class="col-8"> 
     <div class="row">
  
       <div class="col-6">
         <!------------- NOTE ------------------>
         <button class="btn btn-new-grey mb-3" href="#" onClick="addFormField(${id_rep+'notes1'}); return false;">+Note &nbsp;<i class="fa fa-sticky-note"></i></button>
         <br>
         <form action="#" method="get" id="form1">
           <input type="hidden" id=${id_rep+'notes1'}>
           <div class="divTxt" id=${id_rep+'notes2'}></div>
         </form>
       </div>
  
       <!-------------CHECKLIST -------------->
       <div class="col-6">
         <button class="btn btn-new-grey mb-3" href="#" onClick="addCheckbox(${id_rep+'check1'}); return false;">+Checklist &nbsp;<i class="fa fa-check-square"></i></button>
         <br>
         <form action="#" method="get" id="form2">
          <input type="hidden" id=${id_rep+'check1'}>
          <div class="divCheckBox" id=${id_rep+'check2'}></div>
         </form>
       </div>
       
     </div>
   </div>
   </div>
  </div>
  `
   //let parent = document.getElementById('place_info')
   let parent = document.getElementsByClassName('place_info')[track]
   console.log(parent)
   parent.appendChild(fill)
  }
  }
  }

function addFormField(id) {
    console.log(id)
    id_origin = id
    id = id.id
    id2 = id.slice(0,id.length-1) +'2'
    to_add = document.createElement('div')
    to_add.className = 'input_field' + id_origin.id
    
    current_input = document.getElementsByClassName('input_field' + id_origin.id)
    if(current_input.length == 0){
      to_add.id = 'input_field'+ id_origin.id + 1
    }
    else{
      cur_num_class = current_input[current_input.length-1].id
      cur_num = cur_num_class[cur_num_class.length - 1]
      console.log(cur_num)
      to_add.id =  'input_field' + id_origin.id + (Number(cur_num)+1)
    }
    to_add.innerHTML = `<div class="d-flex ">
            <span class="textarea" contenteditable "></span><span style='margin: 5px;' class='fa fa-trash' onclick=removeFormField(${to_add.id})></span>
            </div><br>`
    div_element = document.getElementById(id2)
    div_element.appendChild(to_add)
  }

function removeFormField(id) {
  document.getElementById(id.id).remove()
}

function addCheckbox(id) {

  id_origin = id
  id = id.id
  id2 = id.slice(0,id.length-1) +'2'
  to_add = document.createElement('div')
  to_add.className = 'check_field' + id_origin.id
  
    current_input = document.getElementsByClassName('check_field'+id_origin.id)
    if(current_input.length == 0){
      to_add.id = 'check_field'+ id_origin.id + 1
    }
    else{
      cur_num_class = current_input[current_input.length-1].id
      cur_num = cur_num_class[cur_num_class.length - 1]
      console.log(cur_num)
      to_add.id =  'check_field' + id_origin.id + (Number(cur_num)+1)
    }
    console.log(to_add.id)
    to_add.innerHTML = to_add.innerHTML = `<div class="d-flex "> 
                  <input class="form-check-input" type="checkbox" value="" id="defaultCheck1" style="display:inline-block";><span class="textarea"  contenteditable ></span>
                  <span style="margin:5px;" class='fa fa-trash' onclick=removeFormField(${to_add.id})></span>
                  </div><br>`
    div_element = document.getElementById(id2)
    div_element.appendChild(to_add)
  }

function removeCheckBox(id2) {
$(id2.id).remove();
}

// $(document).keypress(function(e) { if(e.keyCode === 13) { e.preventDefault(); return false; } });
// Dealing with Input width
let el = document.querySelector(".input-wrap .input");
let widthMachine = document.querySelector(".input-wrap .width-machine");
el.addEventListener("keyup", () => {
  widthMachine.innerHTML = el.value;
});

// Dealing with Textarea Height
function calcHeight(value) {
  let numberOfLineBreaks = (value.match(/\n/g) || []).length;
  // min-height + lines x line-height + padding + border
  let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 2;
  return newHeight;
}

let textarea = document.querySelector(".resize-ta");
textarea.addEventListener("keyup", () => {
  textarea.style.height = calcHeight(textarea.value) + "px";
});

//add
function saveData(){
  let places_list = document.getElementsByClassName('place_info')
  for(item of places_list){
    places = item.getElementsByClassName('container')
    for(place of places){
      console.log(place.getElementsByClassName('getAllVal')[0])
      let val = place.getElementsByClassName('getAllVal')[0].innerHTML
      let val_list = val.split(',')
      let id = val_list[0]
      let id_rep = val_list[1]
      let name = val_list[2]
      let lati = val_list[3]
      let lng = val_list[4]
      let picture_url = val_list[5]
      let track = val_list[6]
      console.log(picture_url)
    }
  }
}

//get name,id,id_rep,track_num(track the accordion position)
// <div hidden class='getAllVal'>${id},${id_rep+'row'},${name},${lati},${lng},${picture_url},${track}</div>

//The following writes the data
function writeUserDataWithCompletion(id, selected_country, selected_city, start_date, end_date, departure_flight, arrival_flight, hotel) {
  firebase.database().ref('users/' + localStorage.getItem('uid') + '/trip/' + id).set({
      country: selected_country,
      city: selected_city,
      startdate: start_date,
      enddate: end_date,
      departureflight: arrival_flight,
      arrivalflight: departure_flight,
      hotel: hotel,
  }, function (error) {
      if (error) {
          console.log("Add Data Failed!");
      } else {
          console.log("Add Data Done!");
          window.location.href = 'restrictions.html'
      }
  });
}
