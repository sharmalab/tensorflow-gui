let dataFunctions = {
    LoadImageRecord: `

def parse(serialized):
    features = {
            'image': tf.FixedLenFeature([], tf.string),
            'label': tf.FixedLenFeature([], tf.int64)
        }

    parsed_example = tf.parse_single_example(serialized=serialized, features=features)
    image_raw = parsed_example['image']
    image = tf.image.decode_image(image_raw,channels=3)

    #image = tf.decode_raw(image_raw, tf.uint8)
    image = tf.cast(image, tf.float32)
    label = parsed_example['label']
    return image, label

def LoadImageRecord(record_filepath, image_size=() , batch_size=64, shuffle=True, buffer_size=512, num_repeat=1, one_hot_labels=True, num_classes = 10):
    dataset = tf.data.TFRecordDataset(filenames=record_filepath)
    dataset = dataset.map(parse)
    import numpy as np

    if shuffle:
        # If training then read a buffer of the given size and
        # randomly shuffle it.
        dataset = dataset.shuffle(buffer_size=buffer_size)

    # Repeat the dataset the given number of times.
    dataset = dataset.repeat(num_repeat)

    # Get a batch of data with the given size.
    dataset = dataset.batch(batch_size)

    # Create an iterator for the dataset and the above modifications.
    iterator = dataset.make_one_shot_iterator()

    # Get the next batch of images and labels.
    images_batch, labels_batch = iterator.get_next()

    images_batch = tf.reshape(images_batch, [-1, *image_size])

    if(one_hot_labels):
        labels_batch = tf.one_hot(labels_batch, num_classes)

    return images_batch, labels_batch
`,
    CreateImageRecord: `
def _int64_feature(value):
    return tf.train.Feature(int64_list=tf.train.Int64List(value=[value]))

def _bytes_feature(value):
    return tf.train.Feature(bytes_list=tf.train.BytesList(value=[value]))

def CreateImageRecord(savefilename, images, labels, images_string=True):
    # open the TFRecords file
    writer = tf.python_io.TFRecordWriter(savefilename)
    for i in range(len(images)):
        img = images[i]
        label = labels[i]

        # Create a feature
        if images_string:
            feature = {
                'image': _bytes_feature(img),
                'label': _int64_feature(label)
            }
        else:
            feature = {
                'image': _bytes_feature(img.tostring()),
                'label': _int64_feature(label)
            }
        
        # Create an example protocol buffer
        example = tf.train.Example(features=tf.train.Features(feature=feature))
        
        # Serialize to string and write on the file
        writer.write(example.SerializeToString())
    writer.close()

`,
    LoadImageFolder: `
import re
def atoi(text):
    return int(text) if text.isdigit() else text

def natural_keys(text):
    return [ atoi(c) for c in re.split(r'(\d+)', text) ]
    
import glob
def LoadImageFolder(filepath_regex, gray=True, asbytes=False):
    imgids = []
    images = []
    for img in glob.glob(filepath_regex):
        imgids.append(img)

    imgids.sort(key=natural_keys)
    
    for img_path in imgids:
        if asbytes:
            with tf.gfile.FastGFile(img_path, 'rb') as fid:
                img = fid.read()
        else:
            import cv2
            img = cv2.imread(img_path)
            if gray:
                img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        images.append(img)
    
    return images, imgids

`,
    LoadCSV: `
import pandas as pd
import numpy as np
def LoadCSV(filepath):
    data = np.array(pd.read_csv(filepath))
    cols = data.T
    rows = data
    return rows, cols
`
}



module.exports = dataFunctions