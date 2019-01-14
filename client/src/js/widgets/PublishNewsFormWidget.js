import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Button,
  Checkbox,
  Container,
  Dropdown,
  Form,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Message,
  Segment,
  TextArea
} from 'semantic-ui-react';
import { categoryServices } from '../services/CategoryServices';

//import {} from './';

export class PublishNewsFormWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      description: this.props.description,
      category: this.props.category,
      categoryOptions: [],
      subcategory: this.props.subcategory,
      subCategoryOptions: [],
      position: [1, 1],
      subscription: false,
      selectedCategory: false,
      image: this.props.image
    };
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  submit = () => {
    //TODO SERVICE for submitting a new newscase
    //Use ticketService.acceptTicket() with params: ticketId, title, description, lat, lon,
    // categoryId, municipalId for createing a new news
    console.log('submit');
    console.log(this.state);
  };

  getSubCategories(category) {
    //Get subcategories based on the chosen category
    console.log(category);
    categoryServices.getSubCategories(category).then(res => {
      let subcats = [];
      res.data.map(subCat => {
        subcats.push({ key: subCat.id, value: subCat.id, text: subCat.name });
      });
      this.setState({ subCategoryOptions: subcats });
      console.log(this.state.subCategoryOptions);
    });
  }

  componentWillMount() {
    categoryServices.getCategories().then(res => {
      let cats = [];
      res.data.map(cat => {
        cats.push({ key: cat.id, value: cat.id, text: cat.name });
      });
      this.setState({ categoryOptions: cats });
      console.log(this.state.categoryOptions);
    });
  }

  render() {
    return (
      <Container>
        <Grid verticalAlign="middle">
          <Grid.Column>
            <Form size="large">
              <Segment stacked>
                <Form.Field>
                  <label>Brukeren har meldt inn feil om:</label>
                  <Input
                    fluid
                    icon="warning"
                    iconPosition="left"
                    placeholder={'Hva er problemet?'}
                    value={this.state.title}
                    onChange={(event, data) => {
                      this.handleInput('title', data.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Utdypet:</label>
                  <TextArea
                    placeholder={'Beskrivelse'}
                    value={this.state.description}
                    onChange={(event, data) => {
                      this.handleInput('details', data.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <Grid columns={'equal'}>
                    <Grid.Column>
                      <label>Kategori:</label>
                      <Dropdown
                        fluid
                        search
                        selection
                        defaultValue={this.state.category}
                        options={this.state.categoryOptions}
                        placeholder="Kategori"
                        onChange={(event, data) => {
                          this.handleInput('category', data.value);
                          this.setState({ selectedCategory: true });
                          this.getSubCategories(data.value);
                        }}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <label>Underkategori:</label>
                      <Dropdown
                        disabled={!this.state.selectedCategory}
                        fluid
                        search
                        selection
                        options={this.state.subCategoryOptions}
                        placeholder={'Underkategori'}
                        value={this.state.subcategory}
                        onChange={(event, data) => {
                          this.handleInput('subcategory', data.value);
                        }}
                      />
                    </Grid.Column>
                  </Grid>
                </Form.Field>
                {this.state.image ? (
                  <Segment placeholder>
                    <Header icon>
                      <Icon name="image file outline" />
                      Bildemodul her.
                    </Header>
                    <Button primary>Legg til bilde</Button>
                  </Segment>
                ) : null}
                <Button
                  color="blue"
                  fluid
                  size="large"
                  onClick={this.props.submit.bind(
                    this,
                    this.state.title,
                    this.state.description,
                    this.state.position[0],
                    this.state.position[1],
                    this.state.category,
                    /*municipalId*/ 1
                  )}
                >
                  Publiser
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
