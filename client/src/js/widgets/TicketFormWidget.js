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
  Segment
} from 'semantic-ui-react';

import { ticketService } from '../services/TicketServices';
import { categoryServices } from '../services/CategoryServices';

export class TicketFormWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headline: '',
      details: '',
      category: '',
      categoryOptions: [],
      subcategory: '',
      subCategoryOptions: [],
      position: [null, null],
      subscription: 'false',
      selectedCategory: false
    };
  }

  handleInput = (key, value) => {
    this.setState({ [key]: value });
  };

  submit = () => {
    console.log(this.state);
    //lat, lon and municipalId is fetched from the map
    //municipalId could also be fetched from Cookie
    ticketService
      .addTicket(this.state.headline, this.state.details, 1, 1, this.state.category, 1)
      .then(res => console.log(res));
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
                  <label>Hva vil du melde inn?</label>
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
                  <label>Utdyp problemet</label>
                  <Input
                    fluid
                    icon="comment"
                    iconPosition="left"
                    placeholder={'Utdyp'}
                    value={this.state.details}
                    onChange={(event, data) => {
                      this.handleInput('details', data.value);
                    }}
                  />
                </Form.Field>
                <Form.Field>
                  <Grid columns={'equal'}>
                    <Grid.Column>
                      <label>Kategori</label>
                      <Dropdown
                        fluid
                        search
                        selection
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
                      <label>Underkategori</label>
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
                <Segment placeholder>
                  <Header icon>
                    <Icon name="image file outline" />
                    Bildemodul her.
                  </Header>
                  <Button primary>Legg til bilde</Button>
                </Segment>
                <Form.Field>
                  <Checkbox
                    label={<label>Jeg ønsker å abonnere på saken</label>}
                    value={this.state.subscription}
                    onChange={(event, data) => {
                      if (data.checked) {
                        this.handleInput('subscription', 'true');
                      } else {
                        this.handleInput('subscription', 'false');
                      }
                    }}
                  />
                </Form.Field>

                <Button
                  color="blue"
                  fluid
                  size="large"
                  onClick={() => {
                    this.submit();
                  }}
                >
                  Send inn
                </Button>
              </Segment>
            </Form>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}
