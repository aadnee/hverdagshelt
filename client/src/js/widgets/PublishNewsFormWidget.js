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
  Modal,
  Segment,
  TextArea,
  Label
} from 'semantic-ui-react';
import { categoryService } from '../services/CategoryServices';
import Cookies from 'js-cookie';
import { Consumer } from '../context';

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
      image: this.props.image,
      imgModalOpen: false,
      publish: true
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
    this.state.image.map((img, i) => {
      img.id = i;
    });
    console.log(this.state.image);

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
    const mun = Consumer._currentValue.user.municipalId;
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
                {this.state.image.length > 0 ? (
                  <Form.Field>
                    <Label basic as={'label'}>
                      {this.state.image.map((image, i) => {
                        return (
                          <Modal
                            basic
                            dimmer={'inverted'}
                            size={'large'}
                            closeIcon
                            key={i}
                            trigger={
                              <Label
                                id={i}
                                removeIcon={<Icon name={'delete'} />}
                                size={'large'}
                                onRemove={(event, data) => {
                                  let newImages = [];
                                  this.state.image.map((img, i) => {
                                    if (i !== data.id) {
                                      newImages.push(img);
                                    }
                                  });

                                  this.setState({ image: newImages }, () => {
                                    console.log(this.state.image);
                                  });
                                }}
                                as={'a'}
                                content={image.filename}
                              />
                            }
                          >
                            <Modal.Content image>
                              <Image wrapped src={'http://localhost:3000/uploads/' + image.filename} />
                            </Modal.Content>
                          </Modal>
                        );
                      })}
                    </Label>
                  </Form.Field>
                ) : null}
                <Form.Field />
                /*
                <Checkbox
                  checked={this.state.publish}
                  label={<label>Gjør nyhet synlig</label>}
                  onChange={(event, data) => {
                    this.handleInput('publish', data.checked);
                    console.log(data.checked);
                  }}
                />
                */
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
                      mun
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
