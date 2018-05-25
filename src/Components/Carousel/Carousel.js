import React, {Component} from 'react';
import OwlCarousel from 'react-owl-carousel2';
import './owl.carousel.css';
import './owl.theme.default.css';
import './Carousel.css';

const options = {
  loop:false,
  margin:0,
  nav: true,
  dots:false,
  responsiveRefreshRate: 10,
  URLhashListener:true,
  // startPosition: 'URLHash',
  navText : ['<i aria-hidden="true"></i>','<i aria-hidden="true"></i>'],
  responsive:{
      0:{
          items:1
      },
      600:{
          items:1
      },
      1000:{
          items:1
      }
  }
};

export default class Carousel extends Component {
  constructor(props){
    super(props);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
  }
  handleDoubleClick(){
    this.props.showLightbox();
  }
  mapItems(){
    const slides = this.props.data[this.props.currentChapter]['slidesPaths'];
    return slides.map((slide, index) => {
      return (
        <div data-hash={`slide${index + 1}`} onDoubleClick={this.handleDoubleClick} key={index}>
          <img src={slide} alt={`slide${index + 1}`}/>
        </div>
      )
    })
  }
  render(){
    return (
      <OwlCarousel id="carousel-b" ref="car" options={options} >
        {this.mapItems()}
      </OwlCarousel>
    )
  }
}
