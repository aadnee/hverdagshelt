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
import { categoryService } from '../services/CategoryServices';
import Cookies from 'js-cookie';

//import {} from './';

export class PublishNewsFormWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.title,
      description: this.props.description,
      receivedCategory: this.props.category,
      allCats: [],
      category: this.props.category,
      categoryOptions: [],
      subcategory: '',
      subCategoryOptions: [],
      categoryChanged: false,
      position: [1, 1],
      subscription: false,
      image: this.props.image
    };
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  getSubCategories(category) {
    let bool = false;
    let subCats = [];
    let subCatsOpt = [];

    this.state.allCats.map(cat => {
      if (cat.id === category) {
        subCats = cat.subs;
      }
    });

    subCats.map(subCat => {
      if (this.state.receivedCategory === subCat.id) {
        this.setState({ category: subCat.parentId, subcategory: this.state.receivedCategory });
        bool = true;
      }
      subCatsOpt.push({ key: subCat.id, value: subCat.id, text: subCat.name });
    });

    if (bool || this.state.categoryChanged) {
      this.setState({ subCategoryOptions: subCatsOpt });
    }
  }

  componentWillMount() {
    categoryService.getCategories().then(res => {
      let cats = [];
      this.setState({ allCats: res.data });
      res.data.map(cat => {
        cats.push({ key: cat.id, value: cat.id, text: cat.name });
        this.getSubCategories(cat.id);
      });
      this.setState({ categoryOptions: cats });
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
                      this.handleInput('description', data.value);
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
                        value={this.state.category}
                        options={this.state.categoryOptions}
                        placeholder="Kategori"
                        onChange={(event, data) => {
                          this.handleInput('category', data.value);
                          this.setState({ categoryChanged: true }, () => {
                            this.getSubCategories(data.value);
                          });
                        }}
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <label>Underkategori:</label>
                      <Dropdown
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
                  onClick={() =>
                    this.props.accept(
                      this.state.title,
                      this.state.description,
                      this.state.position[0],
                      this.state.position[1],
                      this.state.category,
                      Cookies.get('municipalId')
                    )
                  }
                >
                  {this.props.submitButton}
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
