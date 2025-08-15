from sqlalchemy import create_engine, Column, Integer, String, DateTime, Date, DECIMAL, ForeignKey, func
from sqlalchemy.orm import sessionmaker, relationship, declarative_base

# Lớp cơ sở mà tất cả các models của chúng ta sẽ kế thừa
Base = declarative_base()

# --- 1. HỆ THỐNG TÀI KHOẢN ---
class User(Base):
    __tablename__ = 'User'
    UserID = Column(Integer, primary_key=True)
    Email = Column(String(255), unique=True, nullable=False)
    PasswordHash = Column(String(255), nullable=False)
    FullName = Column(String(255), nullable=False)
    Role = Column(String(20))
    CreatedAt = Column(DateTime, default=func.now())

    # Định nghĩa mối quan hệ
    student_profile = relationship("StudentProfile", back_populates="user", uselist=False)
    tutor_profile = relationship("TutorProfile", back_populates="user", uselist=False)

class StudentProfile(Base):
    __tablename__ = 'StudentProfile'
    StudentID = Column(Integer, ForeignKey('User.UserID'), primary_key=True)
    DateOfBirth = Column(Date)
    PhoneNumber = Column(String(20))
    Address = Column(String(255))

    user = relationship("User", back_populates="student_profile")
    bookings = relationship("Booking", back_populates="student")

class TutorProfile(Base):
    __tablename__ = 'TutorProfile'
    TutorID = Column(Integer, ForeignKey('User.UserID'), primary_key=True)
    Bio = Column(String)
    ExperienceYears = Column(Integer)
    HourlyRate = Column(DECIMAL(10,2))

    user = relationship("User", back_populates="tutor_profile")
    availability_slots = relationship("AvailabilitySlot", back_populates="tutor")
    credentials = relationship("Credential", back_populates="tutor")
    tutor_subjects = relationship("TutorSubject", back_populates="tutor")
    service_listings = relationship("ServiceListing", back_populates="tutor")
    payouts = relationship("Payout", back_populates="tutor")

class Credential(Base):
    __tablename__ = 'Credential'
    CredentialID = Column(Integer, primary_key=True)
    TutorID = Column(Integer, ForeignKey('TutorProfile.TutorID'), nullable=False)
    Title = Column(String(255), nullable=False)
    Issuer = Column(String(255))
    IssueDate = Column(Date)

    tutor = relationship("TutorProfile", back_populates="credentials")

# --- 2. LỊCH & DỊCH VỤ ---
class AvailabilitySlot(Base):
    __tablename__ = 'AvailabilitySlot'
    SlotID = Column(Integer, primary_key=True)
    TutorID = Column(Integer, ForeignKey('TutorProfile.TutorID'), nullable=False)
    StartTime = Column(DateTime, nullable=False)
    EndTime = Column(DateTime, nullable=False)

    tutor = relationship("TutorProfile", back_populates="availability_slots")
    booking = relationship("Booking", back_populates="slot", uselist=False)

class Subject(Base):
    __tablename__ = 'Subject'
    SubjectID = Column(Integer, primary_key=True)
    Name = Column(String(255), nullable=False)

    tutor_subjects = relationship("TutorSubject", back_populates="subject")
    service_listings = relationship("ServiceListing", back_populates="subject")

class TutorSubject(Base):
    __tablename__ = 'TutorSubject'
    TutorID = Column(Integer, ForeignKey('TutorProfile.TutorID'), primary_key=True)
    SubjectID = Column(Integer, ForeignKey('Subject.SubjectID'), primary_key=True)

    tutor = relationship("TutorProfile", back_populates="tutor_subjects")
    subject = relationship("Subject", back_populates="tutor_subjects")

class ServiceListing(Base):
    __tablename__ = 'ServiceListing'
    ServiceID = Column(Integer, primary_key=True)
    TutorID = Column(Integer, ForeignKey('TutorProfile.TutorID'), nullable=False)
    SubjectID = Column(Integer, ForeignKey('Subject.SubjectID'), nullable=False)
    Description = Column(String)
    Price = Column(DECIMAL(10,2))

    tutor = relationship("TutorProfile", back_populates="service_listings")
    subject = relationship("Subject", back_populates="service_listings")
    bookings = relationship("Booking", back_populates="service")

# --- 3. GIAO DỊCH & THANH TOÁN ---
class Booking(Base):
    __tablename__ = 'Booking'
    BookingID = Column(Integer, primary_key=True)
    StudentID = Column(Integer, ForeignKey('StudentProfile.StudentID'), nullable=False)
    ServiceID = Column(Integer, ForeignKey('ServiceListing.ServiceID'), nullable=False)
    SlotID = Column(Integer, ForeignKey('AvailabilitySlot.SlotID'), nullable=False)
    Status = Column(String(20))
    CreatedAt = Column(DateTime, default=func.now())

    student = relationship("StudentProfile", back_populates="bookings")
    service = relationship("ServiceListing", back_populates="bookings")
    slot = relationship("AvailabilitySlot", back_populates="booking")
    payment = relationship("Payment", back_populates="booking", uselist=False)
    review = relationship("Review", back_populates="booking", uselist=False)

class Payment(Base):
    __tablename__ = 'Payment'
    PaymentID = Column(Integer, primary_key=True)
    BookingID = Column(Integer, ForeignKey('Booking.BookingID'), nullable=False)
    Amount = Column(DECIMAL(10,2), nullable=False)
    PaidAt = Column(DateTime, default=func.now())
    Method = Column(String(50))

    booking = relationship("Booking", back_populates="payment")

class Payout(Base):
    __tablename__ = 'Payout'
    PayoutID = Column(Integer, primary_key=True)
    TutorID = Column(Integer, ForeignKey('TutorProfile.TutorID'), nullable=False)
    Amount = Column(DECIMAL(10,2), nullable=False)
    PaidAt = Column(DateTime, default=func.now())

    tutor = relationship("TutorProfile", back_populates="payouts")

class Review(Base):
    __tablename__ = 'Review'
    ReviewID = Column(Integer, primary_key=True)
    BookingID = Column(Integer, ForeignKey('Booking.BookingID'), nullable=False)
    Rating = Column(Integer)
    Comment = Column(String)
    CreatedAt = Column(DateTime, default=func.now())

    booking = relationship("Booking", back_populates="review")