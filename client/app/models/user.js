import DS from 'ember-data';

export default DS.Model.extend({

  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  email: DS.attr('string'),
  username: DS.attr('string'),
  password: DS.attr('string'),
  phone: DS.attr('string'),

  // computed
  fullName: function () {
	   return this.get('firstName') + ' ' + this.get('lastName');
  }.property('firstName', 'lastName')

});
