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

//import {} from './';

export class PublishNewsFormWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headline: this.props.headline,
      details: this.props.details,
      category: this.props.category,
      categoryOptions: [],
      subcategory: this.props.subcategory,
      subCategoryOptions: [],
      position: [null, null],
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
    console.log('submit');
  };

  getSubCategories(category) {
    //TODO SERVICE to get subcategories based on a category and put into this.state.subCategoryOptions[]
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
                    value={this.state.headline}
                    onChange={(event, data) => {
                      this.handleInput('headline', data.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>Utdypet:</label>
                  <TextArea
                    placeholder={'Beskrivelse'}
                    value={this.state.details}
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
                        options={this.state.categoryOptions}
                        placeholder="Kategori"
                        onChange={(event, data) => {
                          this.handleInput('category', data.value);
                          this.setState({ selectedCategory: true });
                          this.getSubCategories();
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
                  onClick={() => {
                    this.submit();
                  }}
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
