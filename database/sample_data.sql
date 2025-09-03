-- Sample data for testing the book shelf
INSERT INTO books (title, original_title, author, language_pair, styles, uuid) VALUES
('The Great Gatsby', 'The Great Gatsby', 'F. Scott Fitzgerald', 'en-zh', '{}', '12345678-1234-1234-1234-123456789abc'),
('Pride and Prejudice', 'Pride and Prejudice', 'Jane Austen', 'en-es', '{}', '87654321-4321-4321-4321-cba987654321'),
('1984', 'Nineteen Eighty-Four', 'George Orwell', 'en-fr', '{}', 'abcdef12-3456-7890-abcd-ef1234567890'),
('福尔摩斯探案集', 'The Adventures of Sherlock Holmes', 'Arthur Conan Doyle', 'en-zh', '{}', 'sherlock1-2345-6789-abcd-ef0123456789');

-- Sample chapters for The Great Gatsby
INSERT INTO chapters (book_id, chapter_number, title, original_title, order_index) VALUES
(1, 1, '第一章', 'Chapter I', 1),
(1, 2, '第二章', 'Chapter II', 2),
(1, 3, '第三章', 'Chapter III', 3);

-- Sample chapters for Pride and Prejudice  
INSERT INTO chapters (book_id, chapter_number, title, original_title, order_index) VALUES
(2, 1, 'Capítulo 1', 'Chapter 1', 1),
(2, 2, 'Capítulo 2', 'Chapter 2', 2);

-- Sample chapters for 1984
INSERT INTO chapters (book_id, chapter_number, title, original_title, order_index) VALUES
(3, 1, 'Chapitre 1', 'Chapter 1', 1),
(3, 2, 'Chapitre 2', 'Chapter 2', 2),
(3, 3, 'Chapitre 3', 'Chapter 3', 3),
(3, 4, 'Chapitre 4', 'Chapter 4', 4);

-- Sample chapters for Sherlock Holmes
INSERT INTO chapters (book_id, chapter_number, title, original_title, order_index) VALUES
(4, 1, '波希米亚丑闻', 'A Scandal in Bohemia', 1),
(4, 2, '红发会', 'The Red-Headed League', 2),
(4, 3, '身份案', 'A Case of Identity', 3),
(4, 4, '博斯科姆比溪谷秘案', 'The Boscombe Valley Mystery', 4);

-- Sample content for The Great Gatsby - Chapter 1
INSERT INTO content_items (book_id, chapter_id, item_id, original_text, translated_text, type, tag_name, order_index) VALUES
(1, 1, 'gatsby-1-1', 'In my younger and more vulnerable years my father gave me some advice that I have carried with me ever since.', '在我年轻幼稚的年纪，父亲给了我一些忠告，至今我仍铭记在心。', 'paragraph', 'p', 1),
(1, 1, 'gatsby-1-2', '"Whenever you feel like criticizing anyone," he told me, "just remember that all the people in this world have not had the advantages that you have had."', '"每当你想批评别人的时候，"他对我说，"要记住，世上并非人人都有你那样的优越条件。"', 'paragraph', 'p', 2),
(1, 1, 'gatsby-1-3', 'He did not say any more, but we have always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that.', '他没再多说什么，但我们一向能够心照不宣地沟通，我明白他的话意味深长。', 'paragraph', 'p', 3);

-- Sample content for Pride and Prejudice - Chapter 1  
INSERT INTO content_items (book_id, chapter_id, item_id, original_text, translated_text, type, tag_name, order_index) VALUES
(2, 4, 'pride-1-1', 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.', 'Es una verdad universalmente reconocida que todo hombre soltero poseedor de una gran fortuna necesita una esposa.', 'paragraph', 'p', 1),
(2, 4, 'pride-1-2', 'However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.', 'Por poco que se conozcan los sentimientos o propósitos de tal hombre al establecerse en un vecindario, esta verdad está tan arraigada en la mente de las familias que lo rodean, que desde el primer momento es considerado como la propiedad legítima de alguna de sus hijas.', 'paragraph', 'p', 2);

-- Sample content for 1984 - Chapter 1
INSERT INTO content_items (book_id, chapter_id, item_id, original_text, translated_text, type, tag_name, order_index) VALUES  
(3, 6, '1984-1-1', 'It was a bright cold day in April, and the clocks were striking thirteen.', 'C était un jour d avril froid et clair, et les horloges sonnaient treize heures.', 'paragraph', 'p', 1),
(3, 6, '1984-1-2', 'Winston Smith, his chin nuzzled into his breast in an effort to escape the vile wind, slipped quickly through the glass doors of Victory Mansions, though not quickly enough to prevent a swirl of gritty dust from entering along with him.', 'Winston Smith, le menton rentré dans le cou pour échapper au vent mauvais, se glissa rapidement derrière les portes de verre des Résidences de la Victoire, mais pas assez rapidement cependant pour empêcher un tourbillon de poussière granuleuse d entrer en même temps que lui.', 'paragraph', 'p', 2);

-- Sample content for Sherlock Holmes - A Scandal in Bohemia
INSERT INTO content_items (book_id, chapter_id, item_id, original_text, translated_text, type, tag_name, order_index) VALUES
(4, 10, 'sherlock-1-1', 'To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name.', '对夏洛克·福尔摩斯来说，她永远是那个女人。我很少听到他用别的称呼提起她。', 'paragraph', 'p', 1),
(4, 10, 'sherlock-1-2', 'In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler.', '在他眼中，她使整个女性黯然失色，独占鳌头。这并不是说他对艾琳·阿德勒怀有类似爱情的感情。', 'paragraph', 'p', 2),
(4, 10, 'sherlock-1-3', 'All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind.', '一切情感，特别是那种情感，对他那冷静、精确而又令人钦佩的平衡心智来说都是可憎的。', 'paragraph', 'p', 3);