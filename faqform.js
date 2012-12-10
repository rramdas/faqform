Faqs = new Meteor.Collection("faqs");
Tags = new Meteor.Collection("tags");

TL = TLog.getLogger(TLog.LOGLEVEL_MAX,true)

Session.set('question_id', null);

if (Meteor.isClient) {


  Meteor.autosubscribe(function () {
    Meteor.subscribe('faqs');
  });

  Template.faqbrowser.questions = function () {
    return Faqs.find({});
  }

  Template.sidebarleft.tags = function () {
    return Tags.find({});
  }

  Template.bar.question = function () {
    var question = Faqs.findOne(Session.get('question_id'));
    var answers  = Faqs.find( {})
    return question ;
  }

  Template.ask.question = function () {
    if (Session.get('question_id')) 
      var question = Faqs.findOne(Session.get('question_id'));
      return question ;
  }

  Template.bar.events ({
    'click button.answer-question': function(e) {
      e.preventDefault();
      var editor = new EpicEditor().load();
    }
  })

  Template.ask.events({

    'click button.save-question': function(e) {

       e.preventDefault();

       var questionShort = $('#question-short').val();
       var questionLong  = $('#question-long').val();

       var id = Faqs.insert({
         q: questionShort, 
         answers: [ {
                      answer: questionLong 
                    } 
                  ],
         created_at: Date.now()
       });

       Meteor.Router.to('/');

     },

    'click button.update-question': function(e) {

       e.preventDefault();

       var questionShort = $('#question-short').val();
       var questionLong  = $('#question-long').val();

       Faqs.update(
        Session.get('question_id'), 
          { $set: {
              q: questionShort, 
              answer: questionLong,
              updated_at: Date.now()
            }
          });

       Meteor.Router.to('/bar/' + Session.get('question_id'));

     }

  });

  Template.bar.events ({
    'click button.delete-button': function(e) {
      e.preventDefault;
      if (Session.get('question_id')) {
        Faqs.remove(Session.get('question_id'));
      }
      $(".alert").alert('close');
    }
  })

  Meteor.Router.add({
    '/'         : 'home',
    '/ask'      : 'ask', 
    '/about'    : 'about',
    '/question' : 'question_page',

    '/edit/:id' : function(id) {
      Session.get('question_id');
      return 'ask';
    },

    '/bar/:id'  : function(id) {
      Session.set('question_id', id);
      return 'bar';
    }
  });

}

if (Meteor.isServer) {

  Meteor.startup(function () {

    TL.info('Faqform application started.');

    if (Faqs.find().count() === 0) {
      TL.info('Preloading some questions');
      var questions = ["Would you be willing to become extremely ugly physically if it meant you would live for 1,000 years at any physical age you chose?",
      "What was your best experience with drugs or alcohol? your worst experience?",
      "Would you rather die peacefully among friends at age 50, or painfull and alone at age 80? Assume that most of the last 30 years would be good ones.",
      "If you were to discover that your closest friend was a heroin dealer, what would you do?",
      "Is it easy for you to accept help when you need it?  Will you ask for help? ",
      "If you were helping to raise money for a charity and someone agreed to make a large contribution if you would perform at the upcoming fund-raising show, would you?  If so, what would you like to perform?  ",
      "Assume the show would have an audience of about 1,000. Would you have one of your fingers surgically removed if it somehow guaranteed immunity from all major diseases? ",
      "Would you like to be famous?  In what way? ",
      "How do you picture your funeral?  Is it important for you to have people mourn your death?"];

      for (var i = 0; i < questions.length; i++) {
        
        Faqs.insert({q: questions[i], 
          tags: [

            { 
              name: "Mongdb"

            },

            {
              name: "Oracle"
            },

            {
              name: "Mysql"
            },

            {
              name: "Redis"
            }
          ],
          answers: 
            [
            
                {  
                   user: "rramdas@gmail.com" , 
                   answer: "Many Congregational churches claim their descent from a family of Protestant denominations formed on a theory of union published by the theologian Robert Browne in 1592. These arose from the Nonconformist religious movement during the Puritan reformation of the Church of England. In Great Britain, the early congregationalists were called separatists or independents to distinguish them from the similarly Calvinistic Presbyterians. Some congregationalists in Britain still call themselves Independent." , 
                   created_at: Date.now()
                },

                {  
                   user: "rramdas2@gmail.com" , 
                   answer: "Anna (killed 653 or 654) was King of East Anglia from the early 640s until his death. Little is known of Anna's life or his reign, as few records have survived from this period. He was one of the three sons of Eni who ruled East Anglia, succeeding after Ecgric was killed in battle by Penda of Mercia. Anna was praised by Bede for his devotion to Christianity and was renowned for the saintliness of his family. In 645 Cenwalh of Wessex was driven from his kingdom by Penda and, due to Anna's influence, he was converted to Christianity while living as an exile at the East Anglian court. Upon his return from exile, Cenwalh re-established Christianity in his own kingdom and the people of Wessex then remained firmly Christian. Following the attack in 651 by Penda on the monastery at Cnobheresburg, which Anna richly endowed, he was forced by Penda to flee into exile. He may have travelled to the western kingdom of the Magonsæte and returned in about 653, but East Anglia was attacked again by Penda soon afterwards and at the Battle of Bulcamp the East Anglian army, led by Anna, was defeated by the Mercians, and Anna and his son Jurmin were both killed. He was succeeded by his brother, Aethelhere" , 
                   created_at: Date.now()
                },

                {  
                   user: "rramdas3@gmail.com" , 
                   answer: "Perl is a high-level, general-purpose, interpreted, dynamic programming language. Though Perl is not officially an acronym,[4] there are various backronyms in use, such as: Practical Extraction and Reporting Language.[5] Perl was originally developed by Larry Wall in 1987 as a general-purpose Unix scripting language to make report processing easier.[6] Since then, it has undergone many changes and revisions. The latest major stable revision is 5.16, released in May 2012. Perl 6 is a complete redesign of the language, announced in 2000 and still under active development as of 2012." ,
                   created_at: Date.now()
                },


            ], 
            created_at: Date.now(), 
            updated_at: Date.now()});

      }
    }
  });

// Data Published 

  Meteor.publish('faqs', function () {
    return Faqs.find();
  });

  Meteor.publish('tags', function () {
    return Faqs.find({}, {tags: 1})
  });

  // Meteor.publish('questions', function (question_id) {
    // return Faqs.findOne({question_id});
  // });

}
