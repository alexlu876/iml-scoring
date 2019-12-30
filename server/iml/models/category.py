from iml import db


question_category_table  \
    = db.Table('question_category',
               db.Column('question_id',
                         db.Integer,
                         db.ForeignKey('questions.id')),
               db.Column('category_id',
                         db.Integer,
                         db.ForeignKey('categories.id')))


class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    parent_id = db.Column(db.Integer, db.ForeignKey('categories.id'))
    name = db.Column(db.String(128))
    description = db.Column(db.UnicodeText())

    subcategories = db.relationship(
        'Category',
        backref=db.backref('supercategory', remote_side=[id]))
    first_order_questions = db.relationship(
        'Question',
        secondary=question_category_table,
        backref='categories')
