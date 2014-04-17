hash-o-matic
============

Hash up an unlimited number of values, but the problem is that the final hashed value is dependent on the order in which these values are added. What hash-o-matic does is it will order the parameters by the parameter's name before hashing. This is useful if you frequently hash the same variables through-out your app(s) but can't recall the order in which the values were added. The only real catch is the variables must have the same naming throughout your code.
