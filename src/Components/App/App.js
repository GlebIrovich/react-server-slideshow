import React, { Component } from 'react';

// carousels
import Carousel from '../Carousel/Carousel';
import Thumbnails from '../Thumbnails/Thumbnails';
import Lightbox from '../Lightbox/Lightbox';
import ChaptersList from '../ChaptersList/ChaptersList';
import CommentBlock from '../CommentBlock/CommentBlock';

const ProjectMap = require('./ProjectMap');

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      lightbox      : false,
      gallery       : false,
      currentChapter: 0,
      isDesktop    : false,
      data          : ProjectMap,
      slide         : 0,
      comments      : [],
      allowComments : false
    }
    this.hideLightbox = this.hideLightbox.bind(this);
    this.showLightbox = this.showLightbox.bind(this);
    this.showGallery = this.showGallery.bind(this);
    this.requestComments = this.requestComments.bind(this);
    this.updateComments = this.updateComments.bind(this);
  }
  hideLightbox(){
    this.setState({
      lightbox: false,
      gallery: false
    })
  }
  showComments(){
    if(!this.state.allowComments) return;
    return (
      <CommentBlock
        slide={this.state.slide}
        updateComments={this.updateComments}
        currentChapter={this.state.currentChapter}
        comments={this.state.comments}/>
    )
    
  }
  showLightbox(){
    this.setState({
      lightbox: true,
      gallery: false,
    })
  }
  showGallery(){
    this.setState({
      lightbox: false,
      gallery: true,
    })
  }
  async requestComments(){
    const url = `${window.location.origin}/api/comments/${this.state.currentChapter}`; // MAKE DYNAMIC WITH STTES
    try{
      const response = await fetch(url);
      const responseJson = await response.json();


      this.setState({
        comments: responseJson
      })
    } catch(e){
      console.log('Comments request failed!');
    }
  }
  updateComments(newComments) {
    this.setState({
      comments: newComments
    })
  }

  updateDimensions() {
    if(window.innerWidth > 600) {
      this.setState({ isDesktop: true });
    } else {
      this.setState({ isDesktop: false });
    }
  }
  componentDidMount() {
    // request commetns
    this.requestComments();

    if(window.innerWidth > 600) this.setState({ thumbnails: true });
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));

    // push to hash
    if(this.props.location.hash) {
      // window.location.hash = ''
      window.location.hash = ""
      window.location.hash = this.props.location.hash
    }
    // set comments
    this.setState({
      allowComments: window.ALLOW_COMMENTS
    })
  }
  componentWillUnmount() {
   window.removeEventListener("resize", this.updateDimensions.bind(this));
  }
  static getDerivedStateFromProps(props, state) {
    // set current slide

    const hash = props.location.hash;
    let slide = state.slide;
    try {
      slide = hash ? parseInt(hash.match(/slide(\d+)/)[1], 10)-1 : 0;
    } catch (e) {

    }

    // Check if root
    if(Object.keys(props.match.params).length === 0) return {currentChapter: 0, slide: slide}
    // do nothing if input if > then length of data
    const chapter = parseInt(props.match.params.chapter, 10)
    if(chapter >= state.data.units.length || !Number.isInteger(chapter)) return state;
    return {
      currentChapter: chapter,
      slide: slide
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    // reload hash and comments
    if(prevProps.match.params.chapter !== this.props.match.params.chapter) {
      window.location.hash = '#slide1';
      this.requestComments();
    }
    if(window.location.hash === ""){
      window.location.hash = '#slide1';
    }
  }
  setBackground(){
    const style = {
      rowWhite: {
        paddingTop: 5
      },
      rowBlue: {
        paddinBottom: 0,
        paddingTop: 20
      },
      title : {
        margin: 0,
        paddingTop: 25
      }
    }
    style.rowBlue.background = this.state.data.color || 'blue';
    return style;
  }
  render() {
    const style = this.setBackground()
    const data = this.state.data['units'];
    return (

      <div className="App">

        <Lightbox
          lightbox  = {this.state.lightbox}
          gallery   = {this.state.gallery}
          hideLightbox = {this.hideLightbox}
          currentChapter={this.state.currentChapter}
          data = {data}
          slide = {this.state.slide} />

        <div className="row white" style={style.rowWhite}>
            { /* LEFT COLUMN */ }
            <div className="col-md-12">
              { /* Lecture title */ }
                <div className="pull-left" style={{paddingLeft:20}}>
                    <p style={style.title}><mark>#{this.state.data.title}</mark></p>
                </div>
                <div className="container">
                  <div className="logo pull-right" style={{padding: 5}}>
                    {this.state.data.logo
                      ? <img src={this.state.data.logo} alt="logo"/>
                      : `&nbsp;`}
                  </div>
                </div>
            </div>
        </div>
        {/* main row */}
        <div className="row blue" style={style.rowBlue}>
          {/*LEFT COLUMN*/}
          <div className="col-md-3">
              <div className="row"></div>
              <div className="row text-right pull-right">

                {/*List of chapters and subchapters*/}
                <ChaptersList
                  showGallery={this.showGallery}
                  currentChapter={this.state.currentChapter}
                  isDesktop = {this.state.isDesktop}
                  data = {data}/>

              </div>
          </div>
          {/*CENTRAL COLUMN*/}

          <div className="col-md-6">
              <div className="row"></div>

                <div>
                  {/*MAIN carouesl*/}

                </div>
                <Carousel
                  showLightbox = {this.showLightbox}
                  currentChapter={this.state.currentChapter}
                  data = {data}
                  isDesktop = {this.state.isDesktop}
                  slide = {this.state.slide}/>

          </div>
          {/*right COLUMN*/}
          <div className="col-md-3"></div>
      </div>

      {/*ROW FOR thumbnails*/}
      <div className="row blue" style={style.rowBlue}>
          {/*Left COLUMN*/}
          <div className="col-md-3"></div>
          {/*CENTRAL COLUMN*/}
          <div className="col-md-6">


              {/*THUMBNAILS*/}
              <Thumbnails
                thumbnails={this.state.isDesktop}
                currentChapter={this.state.currentChapter}
                data = {data}/>


          </div>
          {/*Right COLUMN*/}
          <div className="col-md-3"></div>
      </div>

      {/*ROW FOR CONTRIBUTORS conditional*/}
      <div className="row white" style={{paddingBottom: 20}}>
          {/*Left COLUMN*/}
          <div className="col-md-3"></div>
          {/*CENTRAL COLUMN*/}
          <div className="col-md-6">
              <div>
                  <p><mark># contributors</mark></p>
                  <p>{this.state.data.contributors}</p>
              </div>
          {/*Right COLUMN*/}
          </div>
          <div className="col-md-3"></div>
      </div>

      {/*Row for description CONDITIONAL*/}
      <div className="row white" style={{paddingBottom: 20}}>
          {/*LEFT COLUMN*/}
          <div className="col-md-3"></div>
          {/*CENTRAL COLUMN*/}
          <div className="col-md-6">
              <div>
                  <p><mark># course description</mark></p>
                  <p>{this.state.data.description}</p>
              </div>
          {/*RIGHT COLUMN*/}
          </div>
          <div className="col-md-3"></div>
      </div>


      {/*COMMENTS*/}

      <div className="row white" style={{paddingBottom: 20}}>
          {/*LEFT COLUMN*/}
          <div className="col-md-3"></div>
          {/*CENTRAL COLUMN*/}
          <div className="col-md-6">

            {this.showComments()}

          {/*RIGHT COLUMN*/}
          </div>
          <div className="col-md-3"></div>
      </div>

    </div>
    );
  }
}

export default App;
