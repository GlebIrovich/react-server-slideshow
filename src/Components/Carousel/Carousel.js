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
  componentWillMount() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.refs.car.next()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.refs.car.prev()
    }
  }

  componentWillUpdate(){
    // hide owl controlls if not desktop
    options.nav = true
    if(!this.props.isDesktop) options.nav = false
  }
  render(){
    return (
      <React.Fragment>
      <OwlCarousel id="carousel-b"
        ref="car" options={options}>
        {this.mapItems()}
      </OwlCarousel>
      
      <button onClick={() => this.refs.car.prev()}>
					prev
				</button>

				<button onClick={() => this.refs.car.next()}>
					next
				</button>
      </React.Fragment>
      
    )
  }
}
